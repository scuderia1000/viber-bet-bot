import { ObjectId } from 'mongodb';
import { IId, IMongoId } from '../types/Base';
import Collection from '../../annotation/Collection';
import ApiEntity from '../common/ApiEntity';
import CommonObject from '../common/CommonObject';

interface IBaseSeason {
  competitionId?: ObjectId;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: string | null;
}

export type ISeason = IBaseSeason & IId<number> & IMongoId & CommonObject;

@Collection('seasons')
export class Season extends ApiEntity implements IBaseSeason {
  competitionId?: ObjectId;

  currentMatchday: number;

  endDate: string;

  startDate: string;

  winner: string | null;

  constructor(props: ISeason) {
    super(props.id, props._id);
    this.competitionId = props.competitionId;
    this.currentMatchday = props.currentMatchday;
    this.endDate = props.endDate;
    this.startDate = props.startDate;
    this.winner = props.winner;
  }

  equals(season: ISeason): boolean {
    return (
      this.id === season.id &&
      this.currentMatchday === season.currentMatchday &&
      this.startDate === season.startDate &&
      this.endDate === season.endDate
    );
  }
}
