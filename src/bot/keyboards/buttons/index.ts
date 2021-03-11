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
import { IPrediction } from '../../../domain/predictions/Prediction';

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

const getTextButton = (
  text: string,
  columns = 6,
  rows = 1,
  textHAlign = TextHAlign.CENTER,
  textVAlign = TextVAlign.CENTER,
  bgColor = COLORS.WHITE,
  textSize = TextSize.MEDIUM,
): IButton => ({
  Columns: columns,
  Rows: rows,
  Text: text,
  TextSize: textSize,
  TextHAlign: textHAlign,
  TextVAlign: textVAlign,
  ActionType: ActionType.NONE,
  ActionBody: 'none',
  BgColor: bgColor,
});

const getVSTextButton = (): IButton => ({
  Columns: ButtonSize.S,
  Rows: 2,
  Text: `<font color=#e1e5e4><b><i>VS</i></b></font>`,
  TextSize: TextSize.LARGE,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.NONE,
  ActionBody: 'none',
});

const getTeamEmblemButton = (url: string, columns = ButtonSize.S): IButton => ({
  Columns: columns,
  Rows: 2,
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

const getUserPredictionButtons = (prediction?: IPrediction): IButton[] => {
  const homeTeamPredictScore =
    prediction?.prediction?.homeTeam !== undefined ? String(prediction.prediction.homeTeam) : '';
  const awayTeamPredictScore =
    prediction?.prediction?.awayTeam !== undefined ? String(prediction.prediction.awayTeam) : '';
  const columns = 3;
  return [
    getTextButton(`<b>Прогноз</b>`, 6, undefined, undefined, undefined, undefined, TextSize.LARGE),
    getTextButton(homeTeamPredictScore, columns),
    getTextButton(awayTeamPredictScore, columns),
  ];
};

export const getMessageMatchButton = (match: IMatch, prediction?: IPrediction): IButton[] => [
  getTextButton(
    `<b>${new Date(match.utcDate).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} MSK</b>`,
  ),
  ...getTeamsEmblemButtons(match),
  ...getTeamsNameButtons(match),
  ...getUserPredictionButtons(prediction),
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

export const getTeamPredictionButton = (team: ITeamShort, columns = 6): IButton[] => [
  getTextButton(
    BUTTON.TEAM.PREDICTION_LABEL,
    columns,
    undefined,
    undefined,
    undefined,
    undefined,
    TextSize.LARGE,
  ),
  getTeamEmblemButton(team.crestImageUrl, columns),
  getTeamNameButton(team.name, TextHAlign.CENTER, columns),
];
