import { IApiId, IMongoIdNum, IObject } from '../types/Base';
import { ISeason } from '../seasons/Season';
import MongoId from '../types/MongoId';

interface IArea extends IMongoIdNum {
  name: string;
}

interface IBaseCompetition {
  area: IArea;
  name: string;
  code: string;
  emblemUrl: string;
  currentSeason: ISeason;
  lastUpdated: string;
  seasons?: ISeason[];
}

export type ICompetition = IBaseCompetition & IMongoIdNum & IObject;
export type IApiCompetition = IBaseCompetition & IApiId;

export class Competition extends MongoId implements ICompetition {
  area: IArea;

  code: string;

  currentSeason: ISeason;

  emblemUrl: string;

  lastUpdated: string;

  name: string;

  seasons?: ISeason[];

  constructor(props: ICompetition | IApiCompetition) {
    super(props);
    this.area = props.area;
    this.code = props.code;
    this.currentSeason = props.currentSeason;
    this.emblemUrl = props.emblemUrl;
    this.lastUpdated = props.lastUpdated;
    this.name = props.name;
    this.seasons = props.seasons;
  }

  equals(competition: ICompetition): boolean {
    return (
      this._id === competition._id &&
      this.code === competition.code &&
      this.currentSeason.equals(competition.currentSeason) &&
      this.name === competition.name
    );
  }
}
