import { ObjectId } from 'mongodb';
import { actionButton, disabledActionButton } from './buttons';
import {
  FinalPartPredictionStages,
  MAX_MATCH_COUNT_PER_PAGE,
  PREDICT_SCORE_MAX_VALUE,
} from '../../const';
import {
  DISABLED_TEXT,
  LEAGUES,
  MAKE_PREDICTION,
  NEXT_PAGE,
  PREVIOUS_PAGE,
  SELECT_LEAGUE,
  USER_PREDICTIONS,
  USERS_RESULTS,
} from '../../const/buttons';
import { IButton, IKeyboard, InputFieldState, KeyboardType, MatchTeamType } from '../../types/base';
import COLORS from '../../const/colors';

export const hiddenInputKeyboard = (buttons: IButton[]): IKeyboard => {
  return {
    Type: KeyboardType.KEYBOARD,
    InputFieldState: InputFieldState.HIDDEN,
    Buttons: buttons,
  };
};

/**
 * Клавиатура "Выбрать лигу"
 */
export const selectLeagueKeyboard = (): IKeyboard =>
  hiddenInputKeyboard([
    actionButton(LEAGUES.CHAMPIONS.LABEL, LEAGUES.CHAMPIONS.REPLAY_TEXT, undefined, 2),
    LEAGUES.EUROPE.DISABLED
      ? actionButton(
          `<font color=”${COLORS.DISABLED_TEXT}”><i>${LEAGUES.EUROPE.LABEL} ${DISABLED_TEXT}</i></font>`,
          LEAGUES.EUROPE.REPLAY_DISABLED,
          COLORS.DISABLED_BACKGROUND,
          2,
        )
      : actionButton(LEAGUES.EUROPE.LABEL, LEAGUES.EUROPE.REPLAY_TEXT, undefined, 2),
    LEAGUES.WORLD.DISABLED
      ? actionButton(
          `<font color=”${COLORS.DISABLED_TEXT}”><i>${LEAGUES.WORLD.LABEL} ${DISABLED_TEXT}</i></font>`,
          LEAGUES.WORLD.REPLAY_DISABLED,
          COLORS.DISABLED_BACKGROUND,
          2,
        )
      : actionButton(LEAGUES.WORLD.LABEL, LEAGUES.WORLD.REPLAY_TEXT, undefined, 2),
  ]);

/**
 * Клавиатура "Сделать прогноз"
 */
export const makePredictionKeyboard = (): IKeyboard =>
  hiddenInputKeyboard([
    actionButton(MAKE_PREDICTION.LABEL, MAKE_PREDICTION.REPLAY_TEXT),
    actionButton(USER_PREDICTIONS.LABEL, USER_PREDICTIONS.REPLAY_TEXT, undefined, 2),
    USERS_RESULTS.DISABLED
      ? actionButton(
          `<font color=”${COLORS.DISABLED_TEXT}”><i>${USERS_RESULTS.LABEL} ${DISABLED_TEXT}</i></font>`,
          USERS_RESULTS.REPLAY_DISABLED,
          COLORS.DISABLED_BACKGROUND,
          2,
        )
      : actionButton(USERS_RESULTS.LABEL, USERS_RESULTS.REPLAY_TEXT, undefined, 2),
    actionButton(SELECT_LEAGUE.LABEL, SELECT_LEAGUE.REPLAY_TEXT, undefined, 2),
  ]);

/**
 * Клавиатура "Сделать прогноз" с кнопками Вперед, Назад
 */
export const makePredictionKeyboardPaged = (pageNumber: number, allCount: number): IKeyboard =>
  hiddenInputKeyboard([
    pageNumber > 0
      ? actionButton(
          PREVIOUS_PAGE.LABEL,
          `${PREVIOUS_PAGE.REPLAY_TEXT}page=${pageNumber - 1}`,
          undefined,
          3,
        )
      : disabledActionButton(PREVIOUS_PAGE.LABEL, '', 3),
    (pageNumber + 1) * MAX_MATCH_COUNT_PER_PAGE < allCount
      ? actionButton(
          NEXT_PAGE.LABEL,
          `${NEXT_PAGE.REPLAY_TEXT}page=${pageNumber + 1}`,
          undefined,
          3,
        )
      : disabledActionButton(NEXT_PAGE.LABEL, '', 3),
    actionButton(MAKE_PREDICTION.LABEL, MAKE_PREDICTION.REPLAY_TEXT),
    actionButton(
      `<font color=”${COLORS.DISABLED_TEXT}”><i>${USER_PREDICTIONS.LABEL} ${DISABLED_TEXT}</i></font>`,
      USERS_RESULTS.REPLAY_DISABLED,
      COLORS.DISABLED_BACKGROUND,
      2,
    ),
    // actionButton(USER_PREDICTIONS.LABEL, USER_PREDICTIONS.REPLAY_TEXT, undefined, 2),
    USERS_RESULTS.DISABLED
      ? disabledActionButton(
          `${USERS_RESULTS.LABEL} ${DISABLED_TEXT}`,
          USERS_RESULTS.REPLAY_DISABLED,
          2,
        )
      : actionButton(USERS_RESULTS.LABEL, USERS_RESULTS.REPLAY_TEXT, undefined, 2),
    actionButton(SELECT_LEAGUE.LABEL, SELECT_LEAGUE.REPLAY_TEXT, undefined, 2),
  ]);

/**
 * Клавиатура "Результат матча" с кнопками от 0 до 11
 */
export const predictTeamScoreKeyboard = (
  matchId: ObjectId,
  matchTeamType: MatchTeamType,
  predictStage?: FinalPartPredictionStages,
): IKeyboard => {
  const buttons = [];
  const replayText = predictStage
    ? `matchTeamScore?matchId=${matchId}&matchTeamType=${matchTeamType}&stage=${predictStage}`
    : `matchTeamScore?matchId=${matchId}&matchTeamType=${matchTeamType}`;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < PREDICT_SCORE_MAX_VALUE; i++) {
    buttons.push(actionButton(`${i}`, `${replayText}&score=${i}`, undefined, 1));
  }
  return hiddenInputKeyboard([
    ...buttons,
    actionButton(MAKE_PREDICTION.LABEL, MAKE_PREDICTION.REPLAY_TEXT),
  ]);
};
