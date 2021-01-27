import { DateTimeISOString, IApiId, IId, IMongoId, IObject } from '../types/Base';
import { ISeason } from '../seasons/Season';
import { IArea } from '../areas/Area';
import { IMatch } from '../matches/Match';
import Collection from '../../annotation/Collection';
import ApiEntity from '../common/ApiEntity';

interface IBaseCompetition {
  area: IArea;
  name: string;
  code: string;
  emblemUrl: string;
  currentSeason: ISeason;
  lastUpdated: DateTimeISOString;
  seasons?: ISeason[];
  matches?: IMatch[];
}

export type ICompetition = IBaseCompetition & IId<number> & IMongoId & IObject;

@Collection('competitions')
export class Competition extends ApiEntity implements ICompetition {
  area: IArea;

  code: string;

  currentSeason: ISeason;

  emblemUrl: string;

  lastUpdated: string;

  matches?: IMatch[];

  name: string;

  seasons?: ISeason[];

  constructor(props: ICompetition & IId<number>) {
    super(props._id, props.id);
    this.area = props.area;
    this.code = props.code;
    this.currentSeason = props.currentSeason;
    this.emblemUrl = props.emblemUrl;
    this.lastUpdated = props.lastUpdated;
    this.matches = props.matches;
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
