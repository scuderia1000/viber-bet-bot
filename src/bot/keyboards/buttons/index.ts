import { ObjectId } from 'mongodb';
import {
  ActionType,
  BgMediaScaleType,
  ButtonSize,
  IButton,
  TextHAlign,
  TextSize,
  TextVAlign,
} from '../../../types/base';
import { IMatch } from '../../../domain/matches/Match';
import { BUTTON } from '../../../const';
import COLORS from '../../../const/colors';
import { ITeamShort } from '../../../domain/teams/TeamShort';

export const button = (
  text: string,
  replayText: string,
  bgColor = COLORS.YELLOW,
  columns = ButtonSize.XXL,
  rows = 1,
): IButton => ({
  Columns: columns,
  Rows: rows,
  Text: text,
  TextSize: TextSize.MEDIUM,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.REPLY,
  ActionBody: replayText,
  BgColor: bgColor,
});

export const matchButton = (
  text: string,
  replayText: string,
  bgColor = COLORS.YELLOW,
): IButton => ({
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
  Columns: ButtonSize.S,
  Rows: 3,
  Text: `<font color=#e1e5e4><b><i>VS</i></b></font>`,
  TextSize: TextSize.LARGE,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.NONE,
  ActionBody: 'none',
});

const getTeamEmblemButton = (url: string, buttonSize = ButtonSize.S): IButton => ({
  Columns: buttonSize,
  Rows: 3,
  ActionType: ActionType.NONE,
  ActionBody: 'none',
  Image: url,
  ImageScaleType: BgMediaScaleType.FIT,
});

const getTeamsEmblemButtons = (match: IMatch): IButton[] => {
  return [
    getTeamEmblemButton(match.homeTeam.crestImageUrl),
    getVSTextButton(),
    getTeamEmblemButton(match.awayTeam.crestImageUrl),
  ];
};

const getTeamNameButton = (
  name: string,
  textHAlign: TextHAlign,
  buttonSize = ButtonSize.M,
): IButton => ({
  Columns: buttonSize,
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
  BgColor: COLORS.YELLOW,
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

const getTeamPredictionTitleButton = (): IButton => ({
  Columns: ButtonSize.XXL,
  Rows: 1,
  Text: BUTTON.TEAM.PREDICTION_LABEL,
  TextSize: TextSize.LARGE,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.NONE,
  ActionBody: 'none',
});

export const getTeamPredictionButton = (team: ITeamShort): IButton[] => [
  getTeamPredictionTitleButton(),
  getTeamEmblemButton(team.crestImageUrl, ButtonSize.XXL),
  getTeamNameButton(team.name, TextHAlign.CENTER, ButtonSize.XXL),
];
