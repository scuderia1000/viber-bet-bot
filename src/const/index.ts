export const conversationStartedText = (userName: string): string =>
  `Привет ${userName}! Я чат-бот Вася! Я принимаю ставки на Лигу Чемпионов 2020 - 2021, делайте ваши ставки господа!`;

export const DB = {
  DEFAULT_NAME: 'viber-bet-bot',
  SUCCESS_CONNECTION: 'Connected successfully to DB server',
};

export enum ROLES {
  ADMIN = 'admin',
  USER = 'user',
}

export const API = {
  FOOTBALL_DATA_ORG: {
    PREFIX: 'v2',
    COMPETITIONS: 'competitions',
    MATCHES: 'matches',
    TEAMS: 'teams',
    LEAGUE_CODE: {
      CHAMPIONS: 'CL',
    },
    CHAMPIONS_LEAGUE: {
      AVAILABLE_STAGES: [
        // счет начинается с 1 в currentMatchday
        'NONE',
        '1ST_QUALIFYING_ROUND',
        '2ND_QUALIFYING_ROUND',
        '3RD_QUALIFYING_ROUND',
        'PLAY_OFF_ROUND',
        'GROUP_STAGE',
        'ROUND_OF_16',
        'QUARTER_FINALS',
        'SEMI_FINALS',
        'FINAL',
      ],
    },
  },
};

export const VIBER_MIN_API_LEVEL = 6;

export const PREDICT_SCORE_MAX_VALUE = 12;

export const MATCH_BEGAN_TEXT = 'Упс..., матч уже начался, ставки больше не принимаются';
