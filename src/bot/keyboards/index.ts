import { ObjectId } from 'mongodb';
import { button } from './buttons';
import { BUTTON, PREDICT_SCORE_MAX_VALUE } from '../../const';
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
  hiddenInputKeyboard([button(BUTTON.MAKE_PREDICTION.LABEL, BUTTON.MAKE_PREDICTION.REPLAY_TEXT)]);

/**
 * Клавиатура "Результат матча" с кнопками от 1 до 12
 */
export const predictTeamScoreKeyboard = (
  matchId: ObjectId,
  matchTeamType: MatchTeamType,
): IKeyboard => {
  const buttons = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= PREDICT_SCORE_MAX_VALUE; i++) {
    buttons.push(
      button(
        `${i}`,
        `matchTeamScore?matchId=${matchId}&matchTeamType=${matchTeamType}`,
        undefined,
        1,
      ),
    );
  }
  return hiddenInputKeyboard([
    ...buttons,
    button(BUTTON.MAKE_PREDICTION.LABEL, BUTTON.MAKE_PREDICTION.REPLAY_TEXT),
  ]);
};
