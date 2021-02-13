import { Bot, Bot as ViberBot, Message } from 'viber-bot';
import { makePredictionKeyboard } from './keyboards';
import { API, conversationStartedText } from '../const';
import { IModules } from '../domain';
import logger from '../util/logger';
import getScheduledMatchesMessage from './messages/rich-media';

const initializeBot = (token: string, modules: IModules): Bot => {
  const TextMessage = Message.Text;
  const RichMediaMessage = Message.RichMedia;

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

  // Нажали на кнопку Сделать прогноз
  bot.onTextMessage(/^makePrediction$/i, async (message, response) => {
    logger.debug('user', response.userProfile);
    logger.debug('makePrediction message', message);

    const scheduledMatches = await modules.matchModule.service.getScheduledMatches(
      API.FOOTBALL_DATA_ORG.LEAGUE_CODE.CHAMPIONS,
    );

    response.send(
      new RichMediaMessage(
        getScheduledMatchesMessage(scheduledMatches),
        makePredictionKeyboard(),
        undefined,
        undefined,
        undefined,
        undefined,
        4,
      ),
    );
  });

  // Нажали на кнопку Сделать прогноз в сообщении о матчах
  bot.onTextMessage(/^matchPrediction_.*$/i, async (message, response) => {
    logger.debug('user', response.userProfile);
    logger.debug('matchPrediction_ message', message);

    // const scheduledMatches = await modules.matchModule.service.getScheduledMatches(
    //   API.FOOTBALL_DATA_ORG.LEAGUE_CODE.CHAMPIONS,
    // );
    //
    // response.send(new RichMediaMessage(getScheduledMatchesMessage(scheduledMatches)));
  });
  // TODO пока переход сразу на Сделать прогноз, добавить историю и переходить на предыдущий шаг
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
