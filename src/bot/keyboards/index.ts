import { ObjectId } from 'mongodb';
import { actionButton } from './buttons';
import { PREDICT_SCORE_MAX_VALUE } from '../../const';
import {
  DISABLED_TEXT,
  LEAGUES,
  MAKE_PREDICTION,
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
 * Клавиатура "Результат матча" с кнопками от 0 до 11
 */
export const predictTeamScoreKeyboard = (
  matchId: ObjectId,
  matchTeamType: MatchTeamType,
): IKeyboard => {
  const buttons = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < PREDICT_SCORE_MAX_VALUE; i++) {
    buttons.push(
      actionButton(
        `${i}`,
        `matchTeamScore?matchId=${matchId}&matchTeamType=${matchTeamType}&score=${i}`,
        undefined,
        1,
      ),
    );
  }
  return hiddenInputKeyboard([
    ...buttons,
    actionButton(MAKE_PREDICTION.LABEL, MAKE_PREDICTION.REPLAY_TEXT),
  ]);
};
