import { IArea } from '../areas/Area';
import { DateTimeISOString, IApiId, IMongoId, IMongoIdNum, IObject } from '../types/Base';
import MongoId from '../types/MongoId';
import { ICompetition } from '../competitions/Competition';
import { IPlayer } from '../players/Player';
import Collection from '../../annotation/Collection';

interface IBaseTeamShort {
  name: string;
}

interface IBaseTeam extends IBaseTeamShort {
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

export type ITeam = IBaseTeam & IMongoId & IObject;
export type IApiTeam = IBaseTeam & IApiId;

export type ITeamShort = IBaseTeamShort & IMongoIdNum & IObject;
export type IApiTeamShort = IBaseTeam & IApiId;

@Collection('teams')
export class Team extends MongoId implements ITeam {
  activeCompetitions: ICompetition[];

  address: string;

  area: IArea;

  clubColors: string;

  crestUrl: string;

  email: string;

  founded: number;

  lastUpdated: DateTimeISOString;

  name: string;

  phone: string;

  shortName: string;

  squad?: IPlayer[];

  tla: string;

  venue: string;

  website: string;

  constructor(props: ITeam | IApiTeam) {
    super(props);
    this.activeCompetitions = props.activeCompetitions;
    this.address = props.address;
    this.area = props.area;
    this.clubColors = props.clubColors;
    this.crestUrl = props.crestUrl;
    this.email = props.email;
    this.founded = props.founded;
    this.lastUpdated = props.lastUpdated;
    this.name = props.name;
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

export class TeamShort extends MongoId implements ITeamShort {
  name: string;

  constructor(props: ITeamShort | IApiTeamShort) {
    super(props);
    this.name = props.name;
  }

  equals(team: ITeamShort): boolean {
    return this._id === team._id && this.name === team.name;
  }
}
