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
import COLORS from '../../../const/colors';
import { ITeamShort } from '../../../domain/teams/TeamShort';
import { IPrediction } from '../../../domain/predictions/Prediction';
import { MAKE_PREDICTION, TEAM } from '../../../const/buttons';
import { MatchStatus } from '../../../domain/types/Base';
import { ChampionsLeagueStages, FinalPartPredictionStages, LeagueCodes, Stages } from '../../../const';

export const actionButton = (
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

export const disabledActionButton = (
  text: string,
  replayText: string,
  columns = ButtonSize.XXL,
  rows = 1,
): IButton => ({
  Columns: columns,
  Rows: rows,
  Text: `<font color=”${COLORS.DISABLED_TEXT}”><i>${text}</i></font>`,
  TextSize: TextSize.MEDIUM,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.REPLY,
  ActionBody: replayText,
  BgColor: COLORS.DISABLED_BACKGROUND,
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
  ...getTextButton(
    `<font color=#e1e5e4><b><i>VS</i></b></font>`,
    2,
    2,
    undefined,
    undefined,
    undefined,
    TextSize.LARGE,
  ),
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
    match.status === MatchStatus.FINISHED
      ? getTextButton(
          `<b>${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}</b>`,
          2,
          2,
        )
      : getVSTextButton(),
    getTeamEmblemButton(match.awayTeam.crestImageUrl),
  ];
};

const getTeamsNameButtons = (match: IMatch): IButton[] => {
  return [
    getTextButton(
      `<b>${match.homeTeam.name}</b>`,
      3,
      1,
      TextHAlign.LEFT,
      undefined,
      undefined,
      TextSize.SMALL,
    ),
    getTextButton(
      `<b>${match.awayTeam.name}</b>`,
      3,
      1,
      TextHAlign.RIGHT,
      undefined,
      undefined,
      TextSize.SMALL,
    ),
  ];
};

const getMakePredictionButton = (matchId: ObjectId, stage: Stages): IButton => ({
  Columns: ButtonSize.XXL,
  Rows: 1,
  Text: MAKE_PREDICTION.LABEL,
  TextSize: TextSize.LARGE,
  TextHAlign: TextHAlign.CENTER,
  TextVAlign: TextVAlign.CENTER,
  ActionType: ActionType.REPLY,
  ActionBody: `matchPrediction?matchId=${matchId}&stage=${stage}`,
  BgColor: COLORS.YELLOW,
});

const getUserPredictionButtons = (prediction?: IPrediction): IButton[] => {
  const homeTeamPredictScore =
    prediction?.score?.fullTime?.homeTeam !== null &&
    prediction?.score?.fullTime?.homeTeam !== undefined
      ? String(prediction?.score.fullTime.homeTeam)
      : '';
  const awayTeamPredictScore =
    prediction?.score?.fullTime?.awayTeam !== null &&
    prediction?.score?.fullTime?.awayTeam !== undefined
      ? String(prediction?.score.fullTime.awayTeam)
      : '';
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
  match.status === MatchStatus.SCHEDULED
    ? getMakePredictionButton(match._id, match.stage as ChampionsLeagueStages)
    : getTextButton(`<b>Матч завершен</b>`),
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
    TEAM.PREDICTION_LABEL,
    columns,
    undefined,
    undefined,
    undefined,
    undefined,
    TextSize.LARGE,
  ),
  getTeamEmblemButton(team.crestImageUrl, columns),
  getTextButton(
    `<b>${team.name}</b>`,
    columns,
    1,
    TextHAlign.CENTER,
    undefined,
    undefined,
    TextSize.SMALL,
  ),
];

const predictStagesLabelMapper = {
  [FinalPartPredictionStages.REGULAR_TIME]: TEAM.REGULAR_TIME_LABEL,
  [FinalPartPredictionStages.EXTRA_TIME]: TEAM.EXTRA_TIME_LABEL,
  [FinalPartPredictionStages.PENALTIES]: TEAM.PENALTIES_LABEL,
};

export const getFinalStageTeamPredictButton = (
  team: ITeamShort,
  columns = 6,
  predictStage: FinalPartPredictionStages,
): IButton[] => [
  getTextButton(
    TEAM.PREDICTION_LABEL,
    columns,
    undefined,
    undefined,
    undefined,
    undefined,
    TextSize.LARGE,
  ),
  getTeamEmblemButton(team.crestImageUrl, columns),
  getTextButton(
    `<b>${team.name}</b>`,
    columns,
    1,
    TextHAlign.CENTER,
    undefined,
    undefined,
    TextSize.SMALL,
  ),
  getTextButton(
    predictStagesLabelMapper[predictStage],
    columns,
    undefined,
    undefined,
    undefined,
    undefined,
    TextSize.LARGE,
  ),
];
