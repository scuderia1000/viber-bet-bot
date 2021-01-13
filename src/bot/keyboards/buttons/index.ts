const fullScreenButton = (text: string, replayText: string, bgColor = '#f7bb3f') => ({
  Columns: 6,
  Rows: 1,
  Text: text,
  TextSize: 'medium',
  TextHAlign: 'center',
  TextVAlign: 'center',
  ActionType: 'reply',
  ActionBody: replayText,
  BgColor: bgColor,
});

export default fullScreenButton;
