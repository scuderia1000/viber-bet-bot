import { LeagueCodes } from './index';

const DISABLED_TEXT = 'в разработке';
const MAKE_PREDICTION_REPLAY_TEXT = 'makePrediction?';
export const MY_PREDICTION_REPLAY_TEXT = 'myPredictions?';

const LEAGUES = {
  CHAMPIONS: {
    LABEL: 'Лига чемпионов',
    REPLAY_TEXT: `setLeague?code=${LeagueCodes.CL}`,
  },
  EUROPE: {
    LABEL: 'Чемпионат европы',
    REPLAY_TEXT: `setLeague?code=${LeagueCodes.EC}`,
    REPLAY_DISABLED: '',
    DISABLED: true,
  },
  WORLD: {
    LABEL: 'Чемпионат мира',
    REPLAY_TEXT: `setLeague?code=${LeagueCodes.WC}`,
    REPLAY_DISABLED: '',
    DISABLED: true,
  },
};

const MAKE_PREDICTION = {
  LABEL: 'Сделать прогноз',
  REPLAY_TEXT: MAKE_PREDICTION_REPLAY_TEXT,
};

const TEAM = {
  PREDICTION_LABEL: 'Сколько забьет',
  REGULAR_TIME_LABEL: 'в основное время',
  EXTRA_TIME_LABEL: 'в дополнительное время',
  PENALTIES_LABEL: 'в серии пенальти',
};

const USER_PREDICTIONS = {
  LABEL: 'Мои прогнозы',
  REPLAY_TEXT: 'myPredictions',
};

const USERS_RESULTS = {
  LABEL: 'Все результаты',
  REPLAY_TEXT: 'usersResults',
  REPLAY_DISABLED: '',
  DISABLED: false,
};

const USERS_PREV_RESULTS = {
  LABEL: 'Результаты пред. тура',
  REPLAY_TEXT: 'prevUsersResults',
  REPLAY_DISABLED: '',
  DISABLED: false,
};

const SELECT_LEAGUE = {
  LABEL: 'Выбрать чемпионат',
  REPLAY_TEXT: 'selectLeague',
};

const NEXT_PAGE = {
  LABEL: 'Вперед',
  REPLAY_TEXT: MAKE_PREDICTION_REPLAY_TEXT,
};

const PREVIOUS_PAGE = {
  LABEL: 'Назад',
  REPLAY_TEXT: MAKE_PREDICTION_REPLAY_TEXT,
};

export {
  MAKE_PREDICTION,
  TEAM,
  USER_PREDICTIONS,
  USERS_RESULTS,
  USERS_PREV_RESULTS,
  LEAGUES,
  DISABLED_TEXT,
  SELECT_LEAGUE,
  NEXT_PAGE,
  PREVIOUS_PAGE,
};
