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

export const BUTTON = {
  MAKE_PREDICTION: {
    LABEL: 'Сделать прогноз',
    REPLAY_TEXT: 'makePrediction',
  },
  TEAM: {
    PREDICTION_LABEL: 'Сколько забьет',
  },
};

export const API = {
  FOOTBALL_DATA_ORG: {
    PREFIX: 'v2',
    COMPETITIONS: 'competitions',
    MATCHES: 'matches',
    TEAMS: 'teams',
    LEAGUE_CODE: {
      CHAMPIONS: 'CL',
    },
  },
};

export const VIBER_MIN_API_LEVEL = 6;

export const PREDICT_SCORE_MAX_VALUE = 12;
