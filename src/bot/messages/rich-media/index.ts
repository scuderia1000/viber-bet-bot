import { IButton, IRichMedia } from '../../../types/base';
import { IMatch } from '../../../domain/matches/Match';
import { getMessageMatchButton } from '../../keyboards/buttons';

const MessageBody: IRichMedia = {
  ButtonsGroupColumns: 6,
  ButtonsGroupRows: 6,
  BgColor: '#FFFFFF',
  Buttons: [],
};

const getScheduledMatchesMessage = (scheduledMatches: IMatch[]): IRichMedia => {
  const buttons: IButton[] = [];
  buttons.push(...getMessageMatchButton(scheduledMatches[0]));
  console.log('buttons', buttons);
  // scheduledMatches.forEach((match) => {
  //   buttons.push(...getMessageMatchButton(match));
  // });

  return {
    ...MessageBody,
    Buttons: buttons,
  };
};

export default getScheduledMatchesMessage;
