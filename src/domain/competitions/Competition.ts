import { DateTimeISOString, IId, IMongoId } from '../types/Base';
import { ISeason } from '../seasons/Season';
import { IArea } from '../areas/Area';
import { IMatch } from '../matches/Match';
import Collection from '../../annotation/Collection';
import ApiEntity from '../common/ApiEntity';
import CommonObject from '../common/CommonObject';
import { ITeam } from '../teams/Team';

interface IBaseCompetition {
  area: IArea;
  name: string;
  code: string;
  emblemUrl: string;
  currentSeason: ISeason;
  lastUpdated: DateTimeISOString;
  seasons?: ISeason[];
  matches?: IMatch[];
  teams?: ITeam[];
  season?: ISeason;
}

export type ICompetition = IBaseCompetition & IId<number> & IMongoId & CommonObject;

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

  teams?: ITeam[];

  season?: ISeason;

  constructor(props: Omit<ICompetition, 'equals'>) {
    super(props.id, props._id);
    this.area = props.area;
    this.code = props.code;
    this.currentSeason = props.currentSeason;
    this.emblemUrl = props.emblemUrl;
    this.lastUpdated = props.lastUpdated;
    this.matches = props.matches;
    this.name = props.name;
    this.seasons = props.seasons;
    this.teams = props.teams;
    this.season = props.season;
  }

  equals(competition: ICompetition): boolean {
    return (
      this.id === competition.id &&
      this.code === competition.code &&
      this.currentSeason.equals(competition.currentSeason) &&
      this.name === competition.name
    );
  }
}
