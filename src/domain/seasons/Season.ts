import { IApiId, IMongoId, IMongoIdNum, IObject } from '../types/Base';
import Mongo from '../types/Mongo';
import Collection from '../../annotation/Collection';

interface IBaseSeason {
  apiId?: number;
  competitionId: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: string | null;
}

export type ISeason = IBaseSeason & IMongoId;
export type IApiSeason = IBaseSeason & IApiId;

@Collection('seasons')
export class Season extends Mongo implements ISeason, IObject {
  competitionId: number;

  currentMatchday: number;

  endDate: string;

  startDate: string;

  winner: string | null;

  apiId?: number;

  constructor(props: ISeason | IApiSeason) {
    super(props as ISeason);
    this.competitionId = props.competitionId;
    this.currentMatchday = props.currentMatchday;
    this.endDate = props.endDate;
    this.startDate = props.startDate;
    this.winner = props.winner;
    this.apiId = (props as IApiSeason).id;
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
