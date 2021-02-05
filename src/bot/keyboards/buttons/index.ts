import { ButtonSize } from '../../../types/base';

export const fullScreenButton = (text: string, replayText: string, bgColor = '#f7bb3f') => ({
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

export const matchButton = (text: string, replayText: string, bgColor = '#f7bb3f') => ({
  Columns: ButtonSize.M,
  Rows: 1,
  Text: text,
  TextSize: 'medium',
  TextHAlign: 'center',
  TextVAlign: 'center',
  ActionType: 'reply',
  ActionBody: replayText,
  BgColor: bgColor,
});

export const backButton = (text = '<', replayText = 'back', bgColor = '#f7bb3f') => ({
  Columns: ButtonSize.XS,
  Rows: 1,
  Text: text,
  TextSize: 'medium',
  TextHAlign: 'center',
  TextVAlign: 'center',
  ActionType: 'reply',
  ActionBody: replayText,
  BgColor: bgColor,
});
