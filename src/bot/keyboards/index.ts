import { ObjectId } from 'mongodb';
import { actionButton } from './buttons';
import { PREDICT_SCORE_MAX_VALUE } from '../../const';
import { MAKE_PREDICTION, USER_PREDICTIONS, USERS_RESULTS } from '../../const/buttons';
import { IButton, IKeyboard, InputFieldState, KeyboardType, MatchTeamType } from '../../types/base';

export const hiddenInputKeyboard = (buttons: IButton[]): IKeyboard => {
  return {
    Type: KeyboardType.KEYBOARD,
    InputFieldState: InputFieldState.HIDDEN,
    Buttons: buttons,
  };
};

/**
 * Клавиатура "Сделать прогноз"
 */
export const makePredictionKeyboard = (): IKeyboard =>
  hiddenInputKeyboard([
    actionButton(MAKE_PREDICTION.LABEL, MAKE_PREDICTION.REPLAY_TEXT),
    actionButton(USER_PREDICTIONS.LABEL, USER_PREDICTIONS.REPLAY_TEXT, undefined, 3),
    actionButton(USERS_RESULTS.LABEL, USERS_RESULTS.REPLAY_TEXT, undefined, 3),
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
