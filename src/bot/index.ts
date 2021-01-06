import { Bot, Bot as ViberBot, Events as BotEvents, Message } from 'viber-bot';
import createLogger from '../util/logger';
import { ViberResponse } from '../types/base';
import { createMessage } from '../util';

const initializeBot = (token: string): Bot => {
  const TextMessage = Message.Text;
  const logger = createLogger();

  const bot = new ViberBot(logger, {
    authToken: token,
    name: 'Phoenix Bet Bot', // <--- Your bot name here
    avatar: 'https://viber-bot.s3.eu-central-1.amazonaws.com/phoenix_007.jpg', // It is recommended to be 720x720, and no more than 100kb.
  });

  const say = (response: ViberResponse, message: string): void => {
    response.send(new TextMessage(message));
  };

  bot.onSubscribe((response: ViberResponse) => {
    say(response, createMessage(response.userProfile.name, bot.name).hi());
  });

  bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) =>
    onFinish(new TextMessage(`Hi, ${userProfile.name}! Nice to meet you.`)),
  );

  bot.on(BotEvents.MESSAGE_RECEIVED, (message: Message, response: ViberResponse) => {
    logger.debug('message', message);
    const messageText = (message as Message.Text).text;
    const echoMessage = new TextMessage(
      `Hi ${response.userProfile?.name}! You send: ${messageText}`,
    );
    // Echo's back the message to the client. Your bot logic should sit here.
    response.send(echoMessage);
  });

  // Следующий этап турнира
  bot.onTextMessage(/^\/n$/i, (message, response) =>
    response.send(new TextMessage(`Hi there ${response.userProfile.name}. I am ${bot.name}`)),
  );

  return bot;
};

export default initializeBot;
