import { IButton, IRichMedia } from '../../../types/base';
import { IMatch } from '../../../domain/matches/Match';
import { getMessageMatchButton, getTeamPredictionButton } from '../../keyboards/buttons';
import COLORS from '../../../const/colors';
import { ITeamShort } from '../../../domain/teams/TeamShort';
import { IPrediction } from '../../../domain/predictions/Prediction';
import { REACH_MESSAGES_MAX_COUNT } from '../../../const';

const getMessageBody = (columns = 6, rows = 6): IRichMedia => ({
  ButtonsGroupColumns: columns,
  ButtonsGroupRows: rows,
  BgColor: COLORS.WHITE,
  Buttons: [],
});

export const matchesWithPredictionsMessage = (
  scheduledMatches: IMatch[],
  predictions: Record<string, IPrediction>,
  fromIndex = 0,
): IRichMedia => {
  const buttons: IButton[] = [];
  // eslint-disable-next-line no-plusplus
  for (let i = fromIndex; i < REACH_MESSAGES_MAX_COUNT + fromIndex; i++) {
    const match = scheduledMatches[i];
    const prediction = predictions[match._id.toHexString()];
    buttons.push(...getMessageMatchButton(match, prediction));
  }

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
