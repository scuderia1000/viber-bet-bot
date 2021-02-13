import { backButton, fullScreenButton, matchButton } from './buttons';
import { BUTTON } from '../../const';
import { IMatch } from '../../domain/matches/Match';
import { IButton, InputFieldState, KeyboardType } from '../../types/base';

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

export const hiddenInputKeyboard = (buttons: IButton[]) => {
  return {
    Type: KeyboardType.KEYBOARD,
    InputFieldState: InputFieldState.HIDDEN,
    Buttons: buttons,
  };
};

/**
 * Клавиатура "Сделать прогноз"
 */
export const makePredictionKeyboard = () =>
  hiddenInputKeyboard([
    fullScreenButton(BUTTON.MAKE_PREDICTION.LABEL, BUTTON.MAKE_PREDICTION.REPLAY_TEXT),
  ]);

// const getMatchText = (match: IMatch) => ()

export const getScheduledMatchesKeyboard = (scheduledMatches: IMatch[]) => {
  const buttons: IButton[] = [];
  scheduledMatches.forEach((match) => {
    buttons.push(matchButton(match.homeTeam.name, `${match.homeTeam.id}`));
    buttons.push(matchButton(match.awayTeam.name, `${match.awayTeam.id}`));
  });
  return hiddenInputKeyboard([...buttons, backButton()]);
};
