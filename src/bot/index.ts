import { Bot, Bot as ViberBot, Message } from 'viber-bot';
import { getScheduledMatchesKeyboard, makePredictionKeyboard } from './keyboards';
import { API, conversationStartedText } from '../const';
import { IModules } from '../domain';
import logger from '../util/logger';
import getCompetition from '../api/football-data-org';

const initializeBot = (token: string, modules: IModules): Bot => {
  const TextMessage = Message.Text;

  const bot = new ViberBot(logger, {
    authToken: token,
    name: 'Phoenix Bet Bot', // <--- Your bot name here
    avatar: 'https://drive.google.com/file/d/1mIEk848MQRMjPd7lpaZEmjYCqmDKwpHv/view?usp=sharing', // It is recommended to be 720x720, and no more than 100kb.
  });

  // const sendResponse = (response: ViberResponse, message: string): void => {
  //   response.send(new TextMessage(message));
  // };

  bot.onConversationStarted(async (userProfile, isSubscribed, context, onFinish) => {
    await modules.userModule.service.saveViberUser(userProfile);
    onFinish(
      new TextMessage(
        conversationStartedText(userProfile.name),
        makePredictionKeyboard(),
        undefined,
        undefined,
        undefined,
        4,
      ),
    );
  });

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
  bot.onTextMessage(/^makePrediction$/i, async (message, response) => {
    logger.debug('user', response.userProfile);

    const scheduledMatches = await modules.matchModule.service.getScheduledMatches(
      API.FOOTBALL_DATA_ORG.LEAGUE_CODE.CHAMPIONS,
    );

    response.send(
      new TextMessage(
        `Hi there ${response.userProfile.name}. I am ${bot.name}`,
        getScheduledMatchesKeyboard(scheduledMatches),
        undefined,
        undefined,
        undefined,
        4,
      ),
    );
  });
  // TODO пока переход сразу на Сделать прогноз
  // Нажали на кнопку Назад
  bot.onTextMessage(/^back$/i, async (message, response) => {
    response.send(
      new TextMessage(
        `Hi there ${response.userProfile.name}. You are go back`,
        makePredictionKeyboard(),
        undefined,
        undefined,
        undefined,
        4,
      ),
    );
  });

  return bot;
};

export default initializeBot;
