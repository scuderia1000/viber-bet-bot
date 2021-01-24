import { IApiId, IMongoIdNum, IObject } from '../types/Base';
import Mongo from '../types/Mongo';

interface IBaseSeason {
  competitionId: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: string | null;
}

export type ISeason = IBaseSeason & IMongoIdNum & IObject;
export type IApiSeason = IBaseSeason & IApiId;

export class Season extends Mongo implements ISeason {
  competitionId: number;

  currentMatchday: number;

  endDate: string;

  startDate: string;

  winner: string | null;

  constructor(props: ISeason | IApiSeason) {
    super(props);
    this.competitionId = props.competitionId;
    this.currentMatchday = props.currentMatchday;
    this.endDate = props.endDate;
    this.startDate = props.startDate;
    this.winner = props.winner;
  }

  equals(season: ISeason): boolean {
    return (
      this._id === season._id &&
      this.startDate === season.startDate &&
      this.endDate === season.endDate
    );
  }
}
// export const Season = (props: ISeason) => ({ ...props });
