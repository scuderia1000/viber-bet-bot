import { ISeason } from '../seasons/Season';
import { DateTimeISOString, IId, IMongoId, MatchStatus, Winner } from '../types/Base';
import Collection from '../../annotation/Collection';
import ApiEntity from '../common/ApiEntity';
import { ITeamShort } from '../teams/TeamShort';
import CommonObject from '../common/CommonObject';
import { ChampionsLeagueStages, Stages } from '../../const';

export interface IScoreResult {
  homeTeam: number | null;
  awayTeam: number | null;
}

export interface IScore {
  winner?: Winner;
  duration?: string;
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
  utcDate: Date;
  status: MatchStatus;
  matchday: number | null;
  stage: Stages;
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

  matchday: number | null;

  score: IScore;

  season: ISeason;

  stage: Stages;

  status: MatchStatus;

  utcDate: Date;

  constructor(props: Omit<IMatch, 'equals'>) {
    super(props.id, props._id);
    this.awayTeam = props.awayTeam;
    this.group = props.group;
    this.homeTeam = props.homeTeam;
    this.lastUpdated = props.lastUpdated;
    this.matchday = props.matchday;
    this.score = props.score;
    this.season = props.season;
    this.stage = props.stage;
    this.status = props.status;
    this.utcDate = new Date(props.utcDate);
  }

  equals(match: IMatch): boolean {
    return (
      this.id === match.id &&
      this.status === match.status &&
      this.stage === match.stage &&
      this.season.currentMatchday === match.season.currentMatchday &&
      this.utcDate.getTime() === match.utcDate.getTime()
    );
  }
}
