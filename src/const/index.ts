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

export enum ChampionsLeagueStages {
  'NONE' = 'NONE',
  '1ST_QUALIFYING_ROUND' = '1ST_QUALIFYING_ROUND',
  '2ND_QUALIFYING_ROUND' = '2ND_QUALIFYING_ROUND',
  '3RD_QUALIFYING_ROUND' = '3RD_QUALIFYING_ROUND',
  'PLAY_OFF_ROUND' = 'PLAY_OFF_ROUND',
  'GROUP_STAGE' = 'GROUP_STAGE',
  'ROUND_OF_16' = 'ROUND_OF_16',
  'QUARTER_FINALS' = 'QUARTER_FINALS',
  'SEMI_FINALS' = 'SEMI_FINALS',
  'FINAL' = 'FINAL',
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

export const predictNotFoundMessage = (matchDay: number): string =>
  `Ты не делал прогноз на матчи ${
    Object.values(championsLeagueStagesToRuTextMapper)[matchDay]
  } этапа`;
