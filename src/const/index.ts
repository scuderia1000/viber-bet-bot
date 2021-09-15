export const conversationStartedText = (userName: string): string =>
  `Привет ${userName}! Я чат-бот Вася! Я принимаю ставки на футбол, выбери чемпионат, на которую хочешь поставить.`;

export const SELECT_LEAGUE_TEXT_MESSAGE = 'Выбери чемпионат';

export const DB = {
  DEFAULT_NAME: 'viber-bet-bot',
  SUCCESS_CONNECTION: 'Connected successfully to DB server',
};

export enum ROLES {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ChampionsLeagueStages {
  NONE = 'NONE',
  '1ST_QUALIFYING_ROUND' = '1ST_QUALIFYING_ROUND',
  '2ND_QUALIFYING_ROUND' = '2ND_QUALIFYING_ROUND',
  '3RD_QUALIFYING_ROUND' = '3RD_QUALIFYING_ROUND',
  PLAY_OFF_ROUND = 'PLAY_OFF_ROUND',
  GROUP_STAGE = 'GROUP_STAGE',
  ROUND_OF_16 = 'ROUND_OF_16',
  QUARTER_FINALS = 'QUARTER_FINALS',
  SEMI_FINALS = 'SEMI_FINALS',
  FINAL = 'FINAL',
}

export enum EuroCupStages {
  NONE = 'NONE',
}

export enum WorldCupStages {
  NONE = 'NONE',
}

export enum LeagueCodes {
  /**
   * Лига чемпионов
   */
  CL = 'CL',
  /**
   * Чемпионат европы
   */
  EC = 'EC',
  /**
   * Чемпионат мира
   */
  WC = 'WC',
}

export const API = {
  FOOTBALL_DATA_ORG: {
    PREFIX: 'v2',
    COMPETITIONS: 'competitions',
    MATCHES: 'matches',
    TEAMS: 'teams',
    LEAGUE_CODE: {
      CHAMPIONS: LeagueCodes.CL,
    },
    CHAMPIONS_LEAGUE: {
      AVAILABLE_STAGES: [
        // TODO исправить использование currentMatchday
        // не верно определил, для чего нужен currentMatchday
        // пока узнал, что он используется в групповом этапе GROUP_STAGE,
        // для обозначения текущего тура
        // счет начинается с 1 в currentMatchday -- неверно использую
        ChampionsLeagueStages.NONE,
        ChampionsLeagueStages['1ST_QUALIFYING_ROUND'],
        ChampionsLeagueStages['2ND_QUALIFYING_ROUND'],
        ChampionsLeagueStages['3RD_QUALIFYING_ROUND'],
        ChampionsLeagueStages.PLAY_OFF_ROUND,
        ChampionsLeagueStages.GROUP_STAGE,
        ChampionsLeagueStages.ROUND_OF_16,
        ChampionsLeagueStages.QUARTER_FINALS,
        ChampionsLeagueStages.SEMI_FINALS,
        ChampionsLeagueStages.FINAL,
      ],
    },
  },
};

export const VIBER_MIN_API_LEVEL = 6;

export const PREDICT_SCORE_MAX_VALUE = 12;

export const MATCH_BEGAN_TEXT = 'Упс..., матч уже начался, ставки больше не принимаются';

export const EMPTY_SCHEDULED_MATCHES = 'Упс..., пока нет запланированных матчей';

export type Stages = ChampionsLeagueStages | EuroCupStages | WorldCupStages;

export const LeagueCodesStageMapper = {
  [LeagueCodes.CL]: ChampionsLeagueStages,
  // TODO добавить этапы для EC и WC
  [LeagueCodes.EC]: EuroCupStages,
  [LeagueCodes.WC]: WorldCupStages,
};

export const LeagueFinalPartMapper = {
  [LeagueCodes.CL]: ChampionsLeagueStages.ROUND_OF_16,
  // TODO добавить этапы для EC и WC
  [LeagueCodes.EC]: EuroCupStages.NONE,
  [LeagueCodes.WC]: WorldCupStages.NONE,
};

export const getFinalPartOfLeagueIndex = (code: LeagueCodes): number =>
  Object.values(LeagueCodesStageMapper[code]).indexOf(LeagueFinalPartMapper[code]);

const championsLeagueStagesToRuTextMapper = {
  [ChampionsLeagueStages.NONE]: '',
  [ChampionsLeagueStages['1ST_QUALIFYING_ROUND']]: '1-го квалификационного раунда',
  [ChampionsLeagueStages['2ND_QUALIFYING_ROUND']]: '2-го квалификационного раунда',
  [ChampionsLeagueStages['3RD_QUALIFYING_ROUND']]: '3-го квалификационного раунда',
  [ChampionsLeagueStages.PLAY_OFF_ROUND]: 'плей-офф',
  [ChampionsLeagueStages.GROUP_STAGE]: 'группового турнира',
  [ChampionsLeagueStages.ROUND_OF_16]: '1/8 финала',
  [ChampionsLeagueStages.QUARTER_FINALS]: '1/4 финала',
  [ChampionsLeagueStages.SEMI_FINALS]: '1/2 финала',
  [ChampionsLeagueStages.FINAL]: 'финала',
};

export const predictNotFoundMessage = (stage: ChampionsLeagueStages): string =>
  `Ты не делал прогноз на матчи ${championsLeagueStagesToRuTextMapper[stage]}`;

export const MAX_MATCH_COUNT_PER_PAGE = 6;

export enum FinalPartPredictionStages {
  REGULAR_TIME = 'regularTime',
  EXTRA_TIME = 'extraTime',
  PENALTIES = 'penalties',
}

export enum TeamType {
  HOME_TEAM = 'homeTeam',
  AWAY_TEAM = 'awayTeam',
}
