import { IButton, IRichMedia } from '../../../types/base';
import { IMatch } from '../../../domain/matches/Match';
import { getMessageMatchButton, getTeamPredictionButton } from '../../keyboards/buttons';
import COLORS from '../../../const/colors';
import { ITeamShort } from '../../../domain/teams/TeamShort';

const MessageBody: IRichMedia = {
  ButtonsGroupColumns: 6,
  ButtonsGroupRows: 6,
  BgColor: COLORS.WHITE,
  Buttons: [],
};

export const getScheduledMatchesMessage = (scheduledMatches: IMatch[]): IRichMedia => {
  const buttons: IButton[] = [];
  buttons.push(...getMessageMatchButton(scheduledMatches[0]));

  return {
    ...MessageBody,
    Buttons: buttons,
  };
};

export const getMatchTeamPredictionMessage = (team: ITeamShort): IRichMedia => {
  return {
    ...MessageBody,
    Buttons: getTeamPredictionButton(team),
  };
};
