import { IArea } from '../areas/Area';
import { DateTimeISOString } from '../types/Base';
import { ICompetition } from '../competitions/Competition';
import { IPlayer } from '../players/Player';
import Collection from '../../annotation/Collection';
import { ITeamShort, TeamShort } from './ShortTeam';

interface IBaseTeam {
  area: IArea;
  activeCompetitions: ICompetition[];
  shortName: string;
  tla: string;
  crestUrl: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  founded: number;
  clubColors: string;
  venue: string;
  squad?: IPlayer[];
  lastUpdated: DateTimeISOString;
}

export type ITeam = IBaseTeam & ITeamShort;

@Collection('teams')
export class Team extends TeamShort implements ITeam {
  activeCompetitions: ICompetition[];

  address: string;

  area: IArea;

  clubColors: string;

  crestUrl: string;

  email: string;

  founded: number;

  lastUpdated: DateTimeISOString;

  phone: string;

  shortName: string;

  squad?: IPlayer[];

  tla: string;

  venue: string;

  website: string;

  constructor(props: ITeam) {
    super(props);
    this.activeCompetitions = props.activeCompetitions;
    this.address = props.address;
    this.area = props.area;
    this.clubColors = props.clubColors;
    this.crestUrl = props.crestUrl;
    this.email = props.email;
    this.founded = props.founded;
    this.lastUpdated = props.lastUpdated;
    this.phone = props.phone;
    this.squad = props.squad;
    this.shortName = props.shortName;
    this.tla = props.tla;
    this.venue = props.venue;
    this.website = props.website;
  }

  equals(team: ITeam): boolean {
    return this._id === team._id && this.lastUpdated === team.lastUpdated;
  }
}
