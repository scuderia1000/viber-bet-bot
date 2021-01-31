import { ISeason, Season } from '../seasons/Season';
import { DateTimeISOString, IId, IMongoId, MatchStatus, Winner } from '../types/Base';
import Collection from '../../annotation/Collection';
import ApiEntity from '../common/ApiEntity';
import { ITeamShort, TeamShort } from '../teams/ShortTeam';
import CommonObject from '../common/CommonObject';

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
  /**
   * Дата начала матча
   */
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

export type IMatch = IBaseMatch & IId<number> & IMongoId & CommonObject;

@Collection('matches')
export class Match extends ApiEntity implements IMatch {
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

  constructor(props: IMatch) {
    super(props._id, props.id);
    this.awayTeam = new TeamShort(props.awayTeam);
    this.group = props.group;
    this.homeTeam = new TeamShort(props.homeTeam);
    this.lastUpdated = props.lastUpdated;
    this.matchday = props.matchday;
    this.score = props.score;
    this.season = new Season(props.season);
    this.stage = props.stage;
    this.status = props.status;
    this.utcDate = props.utcDate;
  }

  equals(match: IMatch): boolean {
    return this.id === match.id && this.status === match.status && this.utcDate === match.utcDate;
  }
}
