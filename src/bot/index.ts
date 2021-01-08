import { Bot, Bot as ViberBot, Events as BotEvents, Message } from 'viber-bot';
import createLogger from '../util/logger';
import { ViberResponse } from '../types/base';
import simpleKeyboard from './keyboards';
import conversationStartedText from '../const';

const initializeBot = (token: string): Bot => {
  const TextMessage = Message.Text;
  const logger = createLogger();

  const bot = new ViberBot(logger, {
    authToken: token,
    name: 'Phoenix Bet Bot', // <--- Your bot name here
    avatar: 'https://viber-bot.s3.eu-central-1.amazonaws.com/phoenix_007.jpg', // It is recommended to be 720x720, and no more than 100kb.
  });

  const sendResponse = (response: ViberResponse, message: string): void => {
    response.send(new TextMessage(message));
  };

  bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) =>
    onFinish(
      new TextMessage(
        conversationStartedText(userProfile.name),
        simpleKeyboard(),
        undefined,
        undefined,
        undefined,
        4,
      ),
    ),
  );

  // bot.on(BotEvents.MESSAGE_RECEIVED, (message: Message, response: ViberResponse) => {
  //   logger.debug('message', message);
  //   const messageText = (message as Message.Text).text;
  //   const echoMessage = new TextMessage(
  //     `Hi ${response.userProfile?.name}! You send: ${messageText}`,
  //   );
  //   // Echo's back the message to the client. Your bot logic should sit here.
  //   response.send(echoMessage);
  // });

  // Нажали на кнопку Сделать прогноз
  bot.onTextMessage(/^makePrediction$/i, (message, response) =>
    response.send(
      new TextMessage(
        `Hi there ${response.userProfile.name}. I am ${bot.name}`,
        simpleKeyboard(),
        undefined,
        undefined,
        undefined,
        4,
      ),
    ),
  );

  return bot;
};

export default initializeBot;
