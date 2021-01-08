import fullScreenButton from './buttons';

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

const simpleKeyboard = () => {
  return {
    Type: 'keyboard',
    InputFieldState: 'hidden',
    Buttons: [fullScreenButton('Сделать прогноз', 'makePrediction')],
  };
};

export default simpleKeyboard;
