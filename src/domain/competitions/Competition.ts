import { IIdNum } from '../Base';

interface IArea extends IIdNum {
  name: string;
}

interface ISeason extends IIdNum {
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: string | null;
}

export interface ICompetition extends IIdNum {
  area: IArea;
  name: string;
  code: string;
  emblemUrl: string;
  currentSeason: ISeason;
  seasons: ISeason[];
  lastUpdated: string;
}

export const Competition = (props: ICompetition): ICompetition => ({ ...props });
