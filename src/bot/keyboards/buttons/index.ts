const fullScreenButton = (text: string, replayText: string, bgColor?: string) => ({
  Columns: 6,
  Rows: 1,
  Text: text,
  TextSize: 'medium',
  TextHAlign: 'center',
  TextVAlign: 'center',
  ActionType: 'reply',
  ActionBody: replayText,
  BgColor: '#f7bb3f',
});

export default fullScreenButton;
