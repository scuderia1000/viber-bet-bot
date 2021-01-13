import fullScreenButton from './buttons';
import { IKeyboardButton, InputFieldState, KeyboardType } from '../../types/base';
import { BUTTON } from '../../const';

const button = (number: number) => ({
  Columns: 6,
  Rows: 1,
  Text: `<font color="#494E67">Number ${number}</font>`,
  TextSize: 'medium',
  TextHAlign: 'center',
  TextVAlign: 'center',
  ActionType: 'reply',
  ActionBody: `Number ${number}`,
  BgColor: '#f7bb3f',
});

export const hiddenInputKeyboard = (buttons: IKeyboardButton[]) => {
  return {
    Type: KeyboardType.KEYBOARD,
    InputFieldState: InputFieldState.HIDDEN,
    Buttons: buttons,
  };
};

export const makePredictionKeyboard = () =>
  hiddenInputKeyboard([
    fullScreenButton(BUTTON.MAKE_PREDICTION.LABEL, BUTTON.MAKE_PREDICTION.REPLAY_TEXT),
  ]);
