import { Bot, Bot as ViberBot, Message } from 'viber-bot';
import { ObjectId } from 'mongodb';
import { makePredictionKeyboard, predictTeamScoreKeyboard } from './keyboards';
import { API, conversationStartedText, MATCH_BEGAN_TEXT, predictNotFoundMessage, VIBER_MIN_API_LEVEL } from '../const';
import { IModules } from '../domain';
import logger from '../util/logger';
import {
  getMatchTeamPredictionMessage,
  matchesWithPredictionsMessage,
} from './messages/rich-media';
import { MatchTeamType, ViberResponse } from '../types/base';
import { IMatch } from '../domain/matches/Match';
import { IPrediction } from '../domain/predictions/Prediction';

const initializeBot = (token: string, modules: IModules): Bot => {
  const TextMessage = Message.Text;
  const RichMediaMessage = Message.RichMedia;

  const matchesRichMessage = (
    scheduledMatches: IMatch[],
    predictions: Record<string, IPrediction>,
  ) =>
    new RichMediaMessage(
      matchesWithPredictionsMessage(scheduledMatches, predictions),
      makePredictionKeyboard(),
      undefined,
      undefined,
      undefined,
      undefined,
      VIBER_MIN_API_LEVEL,
    );

  const sendMatchBeganResponse = (response: ViberResponse): void => {
    response.send(
      new TextMessage(
        MATCH_BEGAN_TEXT,
        makePredictionKeyboard(),
        undefined,
        undefined,
        undefined,
        VIBER_MIN_API_LEVEL,
      ),
    );
  };

  const bot = new ViberBot(logger, {
    authToken: token,
    name: 'Phoenix Bet Bot', // <--- Your bot name here
    avatar: 'https://viberbot.blob.core.windows.net/pictures/phoenix_007.jpg', // It is recommended to be 720x720, and no more than 100kb.
  });

  // Перешли по ссылке
  bot.onConversationStarted(async (userProfile, isSubscribed, context, onFinish) => {
    await modules.userModule.service.saveViberUser(userProfile);
    onFinish(
      new TextMessage(
        conversationStartedText(userProfile.name),
        makePredictionKeyboard(),
        undefined,
        undefined,
        undefined,
        VIBER_MIN_API_LEVEL,
      ),
    );
  });

  // Нажали на кнопку Сделать прогноз
  bot.onTextMessage(/^makePrediction$/i, async (message, response) => {
    const scheduledMatches = await modules.matchModule.service.getScheduledMatches(
      API.FOOTBALL_DATA_ORG.LEAGUE_CODE.CHAMPIONS,
    );
    const userPredictions = await modules.predictionModule.service.getPredictionsByUser(
      response.userProfile.id,
    );

    response.send(matchesRichMessage(scheduledMatches, userPredictions));
  });

  // Нажали на кнопку Сделать прогноз в сообщении о матчах, возвращаем вопрос с
  // логотипом домашней команды и клавиатурой с кнопками от 0 до 11
  bot.onTextMessage(/^matchPrediction_.*$/i, async (message, response) => {
    const messageText = message.text ?? '';

    const matchIdText = messageText.substring(messageText.indexOf('_') + 1, messageText.length);
    if (!matchIdText) return;

    const matchId = new ObjectId(matchIdText);
    // проверяем, что матч еще не начался
    const isMatchBegan = await modules.matchModule.service.isMatchBegan(matchId);
    if (isMatchBegan) {
      sendMatchBeganResponse(response);
      return;
    }

    const homeTeam = await modules.matchModule.service.getMatchTeamByType(
      matchId,
      MatchTeamType.HOME_TEAM,
    );
    if (!homeTeam) return;

    response.send(
      new RichMediaMessage(
        getMatchTeamPredictionMessage(homeTeam),
        predictTeamScoreKeyboard(matchId, MatchTeamType.HOME_TEAM),
        undefined,
        undefined,
        undefined,
        undefined,
        VIBER_MIN_API_LEVEL,
      ),
    );
  });

  // Сделали прогноз, сколько забьет домашняя команда или гости.
  // Нажали на кнопками с цифрами 0 до 11
  bot.onTextMessage(/^matchTeamScore?.*$/i, async (message, response) => {
    const messageArray = message.text?.split('?') ?? ['', ''];
    const messageText = messageArray[1];
    const searchParams = new URLSearchParams(messageText);
    const matchIdText = searchParams.get('matchId') ?? '';
    const matchId = new ObjectId(matchIdText);
    const matchTeamType: MatchTeamType = (searchParams.get('matchTeamType') ??
      MatchTeamType.HOME_TEAM) as MatchTeamType;
    const score = searchParams.get('score') ?? '';
    // проверяем, что матч еще не начался
    const isMatchBegan = await modules.matchModule.service.isMatchBegan(matchId);
    if (isMatchBegan) {
      sendMatchBeganResponse(response);
      return;
    }
    // записать данные о счете
    await modules.predictionModule.service.saveUserPredictScore(
      response.userProfile.id,
      matchId,
      matchTeamType,
      +score,
    );

    if (matchTeamType === MatchTeamType.HOME_TEAM) {
      // вернуть кнопки для прогноза AWAY_TEAM
      const team = await modules.matchModule.service.getMatchTeamByType(
        matchId,
        MatchTeamType.AWAY_TEAM,
      );
      if (team) {
        response.send(
          new RichMediaMessage(
            getMatchTeamPredictionMessage(team),
            predictTeamScoreKeyboard(matchId, MatchTeamType.AWAY_TEAM),
            undefined,
            undefined,
            undefined,
            undefined,
            VIBER_MIN_API_LEVEL,
          ),
        );
      }
    } else {
      // вернуть запланированные матчи со сделанным прогнозом
      const scheduledMatches = await modules.matchModule.service.getScheduledMatches(
        API.FOOTBALL_DATA_ORG.LEAGUE_CODE.CHAMPIONS,
      );
      const userPredictions = await modules.predictionModule.service.getPredictionsByUser(
        response.userProfile.id,
      );
      response.send(matchesRichMessage(scheduledMatches, userPredictions));
    }
  });

  // Нажали на кнопку Мои прогнозы
  bot.onTextMessage(/^myPredictions.*$/i, async (message, response) => {
    const competition = await modules.competitionModule.service.getCompetitionByCode();
    const currentMatchday = competition?.currentSeason.currentMatchday;
    const messageArray = message.text?.split('?') ?? [];
    const matchDayTextParam =
      messageArray.length > 1 ? messageArray[1] : `currentMatchday=${currentMatchday}`;
    const searchParams = new URLSearchParams(matchDayTextParam);
    const matchDay = Number(searchParams.get('currentMatchday'));
    // достать из competitions текущий сезон,
    // из сезона достать currentMatchday: number,
    // из API.FOOTBALL_DATA_ORG.CHAMPIONS_LEAGUE.AVAILABLE_STAGES достать по индексу (currentMatchday) текущий этап,
    // из matches достать все _id матчей с этапом из AVAILABLE_STAGES,
    const stageMatchesIds = await modules.matchModule.service.getMatchesIdsByMatchday(matchDay);
    // из predictions достать все прогнозы юзера с _id матчей, полученных на пред. шаге
    const userPredictions = await modules.predictionModule.service.getPredictionsByMatchesIds(
      response.userProfile.id,
      stageMatchesIds,
    );
    if (!userPredictions) {
      response.send(
        new TextMessage(
          predictNotFoundMessage(matchDay),
          makePredictionKeyboard(),
          undefined,
          undefined,
          undefined,
          VIBER_MIN_API_LEVEL,
        ),
      );
      return;
    }
    const predictMatchesIds = Object.keys(userPredictions).map((matchId) => new ObjectId(matchId));
    const userPredictionsMatches = await modules.matchModule.service.getAllByIds(predictMatchesIds);

    response.send(matchesRichMessage(userPredictionsMatches, userPredictions));
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
        VIBER_MIN_API_LEVEL,
      ),
    );
  });

  return bot;
};

export default initializeBot;
