import { ObjectId } from 'mongodb';
import {
  ActionType,
  IButton,
  TextHAlign,
  TextSize,
  TextVAlign,
  ButtonSize,
} from '../../../types/base';
import { IMatch } from '../../../domain/matches/Match';
import { BUTTON } from '../../../const';

export const fullScreenButton = (
  text: string,
  replayText: string,
  bgColor = '#f7bb3f',
): IButton => ({
  Columns: 6,
  Rows: 1,
  Text: text,
  TextSize: TextSize.MEDIUM,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.REPLY,
  ActionBody: replayText,
  BgColor: bgColor,
});

export const matchButton = (text: string, replayText: string, bgColor = '#f7bb3f'): IButton => ({
  Columns: ButtonSize.M,
  Rows: 1,
  Text: text,
  TextSize: TextSize.MEDIUM,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.REPLY,
  ActionBody: replayText,
  BgColor: bgColor,
});

const getDateButton = (utcDate: Date): IButton => ({
  Columns: ButtonSize.XXL,
  Rows: 1,
  Text: `<b>${new Date(utcDate).toLocaleString('ru-RU')}</b>`,
  TextSize: TextSize.MEDIUM,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.NONE,
  ActionBody: 'none',
});

const getVSTextButton = (): IButton => ({
  Columns: ButtonSize.XS,
  Rows: 3,
  Text: `<font color=#e1e5e4><b><i>VS</i></b></font>`,
  TextSize: TextSize.LARGE,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.NONE,
  ActionBody: 'none',
});

const getTeamEmblemUrlButton = (url: string): IButton => ({
  Columns: ButtonSize.S,
  Rows: 3,
  ActionType: ActionType.NONE,
  ActionBody: 'none',
  Image: url,
});

const getTeamsEmblemButtons = (match: IMatch): IButton[] => {
  return [
    getTeamEmblemUrlButton(match.homeTeam.crestUrl),
    getVSTextButton(),
    getTeamEmblemUrlButton(match.awayTeam.crestUrl),
  ];
};

const getTeamNameButton = (name: string, textHAlign: TextHAlign): IButton => ({
  Columns: ButtonSize.M,
  Rows: 1,
  Text: `<b>${name}</b>`,
  TextSize: TextSize.SMALL,
  TextHAlign: textHAlign,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.NONE,
  ActionBody: 'none',
});

const getTeamsNameButtons = (match: IMatch): IButton[] => {
  return [
    getTeamNameButton(match.homeTeam.name, TextHAlign.LEFT),
    getTeamNameButton(match.awayTeam.name, TextHAlign.RIGHT),
  ];
};

const getMakePredictionButton = (matchId: ObjectId): IButton => ({
  Columns: ButtonSize.XXL,
  Rows: 1,
  Text: BUTTON.MAKE_PREDICTION.LABEL,
  TextSize: TextSize.LARGE,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.REPLY,
  ActionBody: `matchPrediction_${matchId}`,
});

export const getMessageMatchButton = (match: IMatch): IButton[] => [
  getDateButton(match.utcDate),
  ...getTeamsEmblemButtons(match),
  ...getTeamsNameButtons(match),
  getMakePredictionButton(match._id),
];

export const backButton = (text = 'Back', replayText = 'back', bgColor = '#f6f7f9'): IButton => ({
  Columns: ButtonSize.XS,
  Rows: 1,
  Text: text,
  TextSize: TextSize.MEDIUM,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.REPLY,
  ActionBody: replayText,
  BgColor: bgColor,
});
