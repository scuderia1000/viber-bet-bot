import { IId } from '../Base';

export interface ISeason extends IId {
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: string | null;
}

export const Season = (props: ISeason) => ({ ...props });
