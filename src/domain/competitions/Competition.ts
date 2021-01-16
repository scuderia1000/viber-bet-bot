import { IIdNum } from '../Base';
import { ISeason } from '../seasons/Season';

interface IArea extends IIdNum {
  name: string;
}

export interface ICompetition extends IIdNum {
  area: IArea;
  name: string;
  code: string;
  emblemUrl: string;
  currentSeason: ISeason;
  seasons?: ISeason[];
  lastUpdated: string;
}

export const Competition = (props: ICompetition): ICompetition => ({ ...props });
