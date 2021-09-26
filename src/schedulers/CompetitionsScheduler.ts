import 'reflect-metadata';
import { EventManager } from './event-manager';
import { EventType, IScheduler } from '../types/base';
import { Competition } from '../domain/competitions/Competition';
import getApiFootballDataOrg, { IFootballDataOrgApi } from '../api/football-data-org';
import { Season } from '../domain/seasons/Season';
import logger from '../util/logger';

const competitionUpdateInterval = 24 * 60 * 60 * 1000; // 1 день
const matchesUpdateInterval = 60 * 1000; // 30 сек
const teamUpdateInterval = 15 * 1000; // 1 час

export interface ICompetitionsScheduler {
  getCompetition(
    competitionCode: string,
    api: IFootballDataOrgApi,
    events: EventManager,
  ): () => Promise<void>;
  updateCompetitionMatches(
    competitionCode: string,
    api: IFootballDataOrgApi,
    events: EventManager,
  ): () => Promise<void>;
  updateCompetitionTeams(
    competitionCode: string,
    api: IFootballDataOrgApi,
    events: EventManager,
  ): () => Promise<void>;
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
    this.start(
      this.getCompetition(this.competitionCode, this.api, this.events),
      competitionUpdateInterval,
    );
    this.start(
      this.updateCompetitionTeams(this.competitionCode, this.api, this.events),
      teamUpdateInterval,
    );
    this.start(
      this.updateCompetitionMatches(this.competitionCode, this.api, this.events),
      matchesUpdateInterval,
    );
  }

  start(cb: any, delayInMs?: number): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const me = this;
    let { timer } = me;
    timer = (setTimeout(async function callback() {
      await cb();
      // eslint-disable-next-line no-unused-vars
      timer = (setTimeout(callback, delayInMs) as unknown) as number;
    }, delayInMs) as unknown) as number;
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

  // eslint-disable-next-line class-methods-use-this
  updateCompetitionMatches(
    competitionCode: string,
    api: IFootballDataOrgApi,
    events: EventManager,
  ): () => Promise<void> {
    // eslint-disable-next-line func-names
    return async function () {
      const competitionWithMatches = await api.getCompetitionMatches(competitionCode);
      if (!competitionWithMatches || !competitionWithMatches.matches) return;

      events.notify(EventType.GET_MATCHES, competitionWithMatches);
      events.notify(EventType.UPDATE_USER_PREDICTION, competitionWithMatches);
    };
  }

  // eslint-disable-next-line class-methods-use-this
  updateCompetitionTeams(
    competitionCode: string,
    api: IFootballDataOrgApi,
    events: EventManager,
  ): () => Promise<void> {
    // eslint-disable-next-line func-names
    return async function () {
      logger.info('updateCompetitionTeams');
      const competitionTeams = await api.getCompetitionTeams(competitionCode);
      logger.debug('competitionTeams: %s', competitionTeams);
      if (!competitionTeams) return;

      events.notify(EventType.GET_TEAMS, competitionTeams);
    };
  }
}
