import 'reflect-metadata';
import { EventManager } from './event-manager';
import { EventType, IScheduler } from '../types/base';
import { Competition, ICompetition } from '../domain/competitions/Competition';
import getApiFootballDataOrg, { IFootballDataOrgApi } from '../api/football-data-org';
import { API } from '../const';
import { Season } from '../domain/seasons/Season';
import { Match } from '../domain/matches/Match';

const defaultInterval = 10 * 1000;
// const defaultInterval = 24 * 60 * 60 * 1000; // 1 день

export interface ICompetitionsScheduler {
  // update or create new competition
  updateCompetition(competition: ICompetition): void;
  // update or create new season
  updateSeason(season: any): void;
  // update or create new matches
  updateMatches(matches: any): void;
  // update or create new match
  updateMatch(match: any): void;
  getCompetition(
    competitionCode: string,
    api: IFootballDataOrgApi,
    events: EventManager,
  ): () => Promise<void>;
  updateCompetitionMatches(): Promise<void>;
}

export class CompetitionsScheduler implements ICompetitionsScheduler, IScheduler {
  public events: EventManager;

  private readonly api: IFootballDataOrgApi;

  private readonly competitionCode: string;

  private timer?: number;
  // eslint-disable-next-line no-undef
  // private timer: NodeJS.Timeout | undefined;

  constructor(events: EventManager, competitionCode: string) {
    this.events = events;
    this.api = getApiFootballDataOrg();
    this.competitionCode = competitionCode;
  }

  run(): void {
    this.start(this.getCompetition(this.competitionCode, this.api, this.events), defaultInterval);
  }

  start(cb: any, delayInMs?: number): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const me = this;
    let { timer } = me;
    timer = setTimeout(async function callback() {
      await cb();
      // eslint-disable-next-line no-unused-vars
      timer = setTimeout(callback, delayInMs);
    }, delayInMs);
  }

  // eslint-disable-next-line class-methods-use-this
  getCompetition(
    competitionCode: string,
    api: IFootballDataOrgApi,
    events: EventManager,
  ): () => Promise<void> {
    // eslint-disable-next-line func-names
    return async function () {
      const result = await api.getCompetition(competitionCode);
      if (!result) return;

      const currentSeason = new Season(result.currentSeason);
      const competition = new Competition({ ...result, currentSeason });
      if (competition.seasons) {
        delete competition.seasons;
      }
      events.notify(EventType.GET_COMPETITION, competition);
      events.notify(EventType.GET_SEASON, competition);
    };
  }

  async updateCompetitionMatches(): Promise<void> {
    const competitionWithMatches = await this.api.getCompetitionMatches(this.competitionCode);
    if (!competitionWithMatches || !competitionWithMatches.matches) return;

    const matches = competitionWithMatches.matches.map((match) => new Match(match));
    console.log('matches', matches);
  }

  updateCompetition(competition: ICompetition): void {}

  updateMatch(match: any): void {}

  updateMatches(matches: any): void {}

  updateSeason(season: any): void {}
}
