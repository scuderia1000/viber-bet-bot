import { IButton, IRichMedia } from '../../../types/base';
import { IMatch } from '../../../domain/matches/Match';
import {
  getFinalStageTeamPredictButton,
  getMessageMatchButton,
  getTeamPredictionButton,
} from '../../keyboards/buttons';
import COLORS from '../../../const/colors';
import { ITeamShort } from '../../../domain/teams/TeamShort';
import { IPrediction } from '../../../domain/predictions/Prediction';
import { FinalPartPredictionStages } from '../../../const';

const getMessageBody = (columns = 6, rows = 6): IRichMedia => ({
  ButtonsGroupColumns: columns,
  ButtonsGroupRows: rows,
  BgColor: COLORS.WHITE,
  Buttons: [],
});

export const matchesWithPredictionsMessage = (
  scheduledMatches: IMatch[],
  predictions: Record<string, IPrediction>,
  page = 0,
): IRichMedia => {
  const buttons: IButton[] = [];
  scheduledMatches.forEach((match) => {
    const prediction = predictions[match._id.toHexString()];
    buttons.push(...getMessageMatchButton(match, prediction, page));
  });

  return {
    ...getMessageBody(6, 7),
    Buttons: buttons,
  };
};

export const getMatchTeamPredictionMessage = (team: ITeamShort): IRichMedia => {
  const columns = 4;
  return {
    ...getMessageBody(columns, 4),
    Buttons: getTeamPredictionButton(team, columns),
  };
};

export const getFinalPartMatchTeamPredictionMessage = (
  team: ITeamShort,
  predictStage: FinalPartPredictionStages,
): IRichMedia => {
  const columns = 4;
  return {
    ...getMessageBody(columns, 5),
    Buttons: getFinalStageTeamPredictButton(team, columns, predictStage),
  };
};
