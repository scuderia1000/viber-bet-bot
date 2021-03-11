import { IButton, IRichMedia } from '../../../types/base';
import { IMatch } from '../../../domain/matches/Match';
import { getMessageMatchButton, getTeamPredictionButton } from '../../keyboards/buttons';
import COLORS from '../../../const/colors';
import { ITeamShort } from '../../../domain/teams/TeamShort';
import { IPrediction } from '../../../domain/predictions/Prediction';

const MessageBody: IRichMedia = {
  ButtonsGroupColumns: 6,
  ButtonsGroupRows: 6,
  BgColor: COLORS.WHITE,
  Buttons: [],
};

const getMessageBody = (columns = 6, rows = 6): IRichMedia => ({
  ButtonsGroupColumns: columns,
  ButtonsGroupRows: rows,
  BgColor: COLORS.WHITE,
  Buttons: [],
});

export const getScheduledMatchesMessage = (
  scheduledMatches: IMatch[],
  predictions: Record<string, IPrediction>,
): IRichMedia => {
  const buttons: IButton[] = [];
  scheduledMatches.forEach((match) => {
    const prediction = predictions[match._id.toHexString()];
    buttons.push(...getMessageMatchButton(match, prediction));
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
