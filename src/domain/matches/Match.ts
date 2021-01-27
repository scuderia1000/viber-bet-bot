import { ISeason } from '../seasons/Season';
import {
  DateTimeISOString,
  IApiId,
  IMongoIdNum,
  IObject,
  MatchStatus,
  Winner,
} from '../types/Base';
import { ITeamShort } from '../teams/Team';
import MongoId from '../types/MongoId';
import Collection from '../../annotation/Collection';

interface IScoreResult {
  homeTeam: number | null;
  awayTeam: number | null;
}

interface IScore {
  winner: Winner;
  duration: string;
  fullTime: IScoreResult;
  halfTime: IScoreResult;
  extraTime: IScoreResult;
  penalties: IScoreResult;
}

interface IBaseMatch {
  season: ISeason;
  utcDate: string;
  status: MatchStatus;
  matchday: string | null;
  // TODO как узнать какие есть этапы?
  //  можно по завершению турнира 2021-05-29 достать из матчей все уникальные stage
  //  и запихать в enum
  stage: string;
  group: string | null; // TODO тоже самое
  lastUpdated: DateTimeISOString;
  score: IScore;
  homeTeam: ITeamShort;
  awayTeam: ITeamShort;
}

export type IMatch = IBaseMatch & IMongoIdNum & IObject;
export type IApiMatch = IBaseMatch & IApiId;

@Collection('matches')
export class Match extends MongoId implements IMatch {
  awayTeam: ITeamShort;

  group: string | null;

  homeTeam: ITeamShort;

  lastUpdated: DateTimeISOString;

  matchday: string | null;

  score: IScore;

  season: ISeason;

  stage: string;

  status: MatchStatus;

  utcDate: string;

  constructor(props: IMatch | IApiMatch) {
    super(props);
    this.awayTeam = props.awayTeam;
    this.group = props.group;
    this.homeTeam = props.homeTeam;
    this.lastUpdated = props.lastUpdated;
    this.matchday = props.matchday;
    this.score = props.score;
    this.season = props.season;
    this.stage = props.stage;
    this.status = props.status;
    this.utcDate = props.utcDate;
  }

  equals(match: IMatch): boolean {
    return this._id === match._id && this.status === match.status && this.utcDate === match.utcDate;
  }
}
