import { Bot, Bot as ViberBot, Message } from 'viber-bot';
import { ObjectId } from 'mongodb';
import {
  makePredictionKeyboard,
  makePredictionKeyboardPaged,
  predictTeamScoreKeyboard,
  selectLeagueKeyboard,
} from './keyboards';
import {
  conversationStartedText,
  EMPTY_SCHEDULED_MATCHES,
  FinalPartPredictionStages,
  getFinalPartOfLeagueIndex,
  LeagueCodes,
  LeagueCodesStageMapper,
  MATCH_BEGAN_TEXT,
  predictNotFoundMessage,
  SELECT_LEAGUE_TEXT_MESSAGE,
  Stages,
  VIBER_MIN_API_LEVEL,
} from '../const';
import { IModules } from '../domain';
import logger from '../util/logger';
import {
  getFinalPartMatchTeamPredictionMessage,
  getMatchTeamPredictionMessage,
  matchesWithPredictionsMessage,
} from './messages/rich-media';
import { IKeyboard, IRichMedia, MatchTeamType, ViberResponse } from '../types/base';
import { IMatch } from '../domain/matches/Match';
import { IPrediction } from '../domain/predictions/Prediction';
import getParams from '../util/parse-message-params';

const initializeBot = (token: string, modules: IModules): Bot => {
  const TextMessage = Message.Text;
  const RichMediaMessage = Message.RichMedia;

  const matchesRichMessage = (
    scheduledMatches: IMatch[],
    predictions: Record<string, IPrediction>,
    keyboard?: IKeyboard,
  ) =>
    new RichMediaMessage(
      matchesWithPredictionsMessage(scheduledMatches, predictions),
      keyboard ?? makePredictionKeyboard(),
      undefined,
      undefined,
      undefined,
      undefined,
      VIBER_MIN_API_LEVEL,
    );

  const sendScheduledMatchesPagedResponse = async (
    message: Message,
    response: ViberResponse,
  ): Promise<boolean> => {
    const user = await modules.userModule.service.getById(response.userProfile.id);
    if (!user) {
      await modules.userModule.service.saveViberUser(response.userProfile);
    }

    const searchParams = getParams(message.text);
    const page = Number(searchParams.get('page') ?? '0');

    const scheduledMatchesPaged = await modules.matchModule.service.getPagedScheduledMatches(
      user?.selectedLeagueCode,
      page,
    );
    const allCount = scheduledMatchesPaged.totalMatchesCount;
    const scheduledMatches = scheduledMatchesPaged.matches;

    const userPredictions = await modules.predictionModule.service.getPredictionsByUser(
      response.userProfile.id,
    );

    if (scheduledMatches.length) {
      const keyboard = makePredictionKeyboardPaged(page, allCount);
      response.send(matchesRichMessage(scheduledMatches, userPredictions, keyboard));
      return true;
    }

    return false;
  };

  const sendResponse = (response: ViberResponse, message: Message): void => {
    response.send(message);
  };

  const sendTextMessage = (response: ViberResponse, text: string, keyboard: IKeyboard): void => {
    sendResponse(
      response,
      new TextMessage(text, keyboard, undefined, undefined, undefined, VIBER_MIN_API_LEVEL),
    );
  };

  const sendRichMediaMessage = (
    response: ViberResponse,
    richMedia: IRichMedia,
    keyboard: IKeyboard,
  ): void => {
    sendResponse(
      response,
      new RichMediaMessage(
        richMedia,
        keyboard,
        undefined,
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
        selectLeagueKeyboard(),
        undefined,
        undefined,
        undefined,
        VIBER_MIN_API_LEVEL,
      ),
    );
  });

  // Нажали Выбрать чемпионат
  bot.onTextMessage(/^selectLeague$/i, async (message, response) => {
    sendTextMessage(response, SELECT_LEAGUE_TEXT_MESSAGE, selectLeagueKeyboard());
  });

  // Выбрали чемпионат
  bot.onTextMessage(/^setLeague?.*$/i, async (message, response) => {
    const searchParams = getParams(message.text);
    const leagueCode = searchParams.get('code') as LeagueCodes;
    if (!leagueCode) return;

    await modules.userModule.service.setLeague(response.userProfile.id, leagueCode);

    const isScheduledMatchesResponseSent = await sendScheduledMatchesPagedResponse(
      message,
      response,
    );
    if (!isScheduledMatchesResponseSent) {
      sendTextMessage(response, EMPTY_SCHEDULED_MATCHES, makePredictionKeyboard());
    }
  });

  // Нажали на кнопку Сделать прогноз в клавиатуре, возвращаем карусель с матчами,
  // в клавиатуре показываем кнопки Вперед, Назад, т.к. стоит ограничение на к-во сообщений в 1 ответе = 6
  bot.onTextMessage(/^makePrediction?.*$/i, async (message, response) => {
    const isScheduledMatchesResponseSent = await sendScheduledMatchesPagedResponse(
      message,
      response,
    );
    if (!isScheduledMatchesResponseSent) {
      sendTextMessage(response, EMPTY_SCHEDULED_MATCHES, makePredictionKeyboard());
    }
  });

  // Нажали на кнопку Сделать прогноз в сообщении о матчах, возвращаем вопрос с
  // логотипом домашней команды и клавиатурой с кнопками от 0 до 11
  bot.onTextMessage(/^matchPrediction?.*$/i, async (message, response) => {
    const user = await modules.userModule.service.getById(response.userProfile.id);
    if (!user) return;

    const searchParams = getParams(message.text);
    const matchIdText = searchParams.get('matchId') ?? '';
    const matchId = new ObjectId(matchIdText);

    const leagueCode = user.selectedLeagueCode ?? LeagueCodes.CL;
    const stageText = searchParams.get('stage') ?? '';
    const isFinalPart = modules.matchModule.service.isFinalPart(leagueCode, stageText as Stages);

    // проверяем, что матч еще не начался
    const isMatchBegan = await modules.matchModule.service.isMatchBegan(matchId);
    if (isMatchBegan) {
      sendTextMessage(response, MATCH_BEGAN_TEXT, makePredictionKeyboard());
      return;
    }

    const homeTeam = await modules.matchModule.service.getMatchTeamByType(
      matchId,
      MatchTeamType.HOME_TEAM,
    );
    if (!homeTeam) return;

    if (isFinalPart) {
      sendRichMediaMessage(
        response,
        getFinalPartMatchTeamPredictionMessage(homeTeam, FinalPartPredictionStages.REGULAR_TIME),
        predictTeamScoreKeyboard(
          matchId,
          MatchTeamType.HOME_TEAM,
          FinalPartPredictionStages.REGULAR_TIME,
        ),
      );
      return;
    }

    sendRichMediaMessage(
      response,
      getMatchTeamPredictionMessage(homeTeam),
      predictTeamScoreKeyboard(matchId, MatchTeamType.HOME_TEAM),
    );
  });

  // Сделали прогноз, сколько забьет домашняя команда или гости.
  // Нажали на кнопками с цифрами 0 до 11
  bot.onTextMessage(/^matchTeamScore?.*$/i, async (message, response) => {
    const searchParams = getParams(message.text);
    const matchIdText = searchParams.get('matchId') ?? '';
    const matchId = new ObjectId(matchIdText);
    // проверяем, что матч еще не начался
    const isMatchBegan = await modules.matchModule.service.isMatchBegan(matchId);
    if (isMatchBegan) {
      sendTextMessage(response, MATCH_BEGAN_TEXT, makePredictionKeyboard());
      return;
    }
    // на какой этап матча сделан прогноз (основное время, дополнительное или серия пенальти)
    const stage = searchParams.get('stage')
      ? (searchParams.get('stage') as FinalPartPredictionStages)
      : undefined;
    // на какую команду (хозяева или гости)
    const matchTeamType: MatchTeamType = (searchParams.get('matchTeamType') ??
      MatchTeamType.HOME_TEAM) as MatchTeamType;

    const match = await modules.matchModule.service.getByMongoId(matchId);
    if (!match) return;
    // записываем данные о счете
    const score = searchParams.get('score') ?? '';
    await modules.predictionModule.service.saveUserPredictScore(
      response.userProfile.id,
      match,
      matchTeamType,
      +score,
      stage,
    );

    if (stage) {
      // определили, что прогноз на финальную часть чемпионата
      const stageValues = Object.values(FinalPartPredictionStages);
      const stageIndex = stageValues.indexOf(stage);
      const nextStageIndex = stageIndex + 1;
      if (nextStageIndex < stageValues.length) {
        const team = await modules.matchModule.service.getMatchTeamByType(matchId, matchTeamType);
        if (!team) return;
        // отправляем сообщение для прогноза на следующий этап матча
        sendRichMediaMessage(
          response,
          getFinalPartMatchTeamPredictionMessage(team, stageValues[nextStageIndex]),
          predictTeamScoreKeyboard(matchId, matchTeamType, stageValues[nextStageIndex]),
        );
        return;
      }
    }
    // этапы матча для домашней команды закончились, переключаем вопросы на гостевую команду
    if (matchTeamType === MatchTeamType.HOME_TEAM) {
      // вернуть кнопки для прогноза AWAY_TEAM
      const team = await modules.matchModule.service.getMatchTeamByType(
        matchId,
        MatchTeamType.AWAY_TEAM,
      );
      if (!team) return;

      const initialStage = stage ? FinalPartPredictionStages.REGULAR_TIME : undefined;
      const richMedia = initialStage
        ? getFinalPartMatchTeamPredictionMessage(team, initialStage)
        : getMatchTeamPredictionMessage(team);
      sendRichMediaMessage(
        response,
        richMedia,
        predictTeamScoreKeyboard(matchId, MatchTeamType.AWAY_TEAM, initialStage),
      );
      return;
    }

    // все прогнозы сделаны, отправляем запланированные матчи со сделанными прогнозами
    const isScheduledMatchesResponseSent = await sendScheduledMatchesPagedResponse(
      message,
      response,
    );
    if (!isScheduledMatchesResponseSent) {
      sendTextMessage(response, EMPTY_SCHEDULED_MATCHES, makePredictionKeyboard());
    }
  });

  // Нажали на кнопку Мои прогнозы
  // TODO переделать, неправильно определил, для чего currentMatchday
  bot.onTextMessage(/^myPredictions.*$/i, async (message, response) => {
    const user = await modules.userModule.service.getById(response.userProfile.id);
    if (!user) return;

    const competition = await modules.competitionModule.service.getCompetitionByCode(
      user.selectedLeagueCode,
    );
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
