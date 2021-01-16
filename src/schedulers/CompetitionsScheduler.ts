import { EventManager } from './event-manager';
import { IScheduler } from '../types/base';
import { ICompetition } from '../domain/competitions/Competition';
import getCompetition from '../api/football-data-org';
import { API } from '../const';
import { ISeasonService } from '../domain/seasons/SeasonService';

const defaultInterval = 60 * 60 * 1000; // 1 час
// код лиги чемпионов
const championsLeague = API.FOOTBALL_DATA_ORG.LEAGUE_CODE.CHAMPIONS;

export interface ICompetitionsScheduler {
  // update or create new competition
  updateCompetition(competition: ICompetition): void;
  // update or create new season
  updateSeason(season: any): void;
  // update or create new matches
  updateMatches(matches: any): void;
  // update or create new match
  updateMatch(match: any): void;
  getCompetition(): void;
}

export class CompetitionsScheduler implements IScheduler, ICompetitionsScheduler {
  private seasonService: ISeasonService;

  public events: EventManager;

  private timerId: number;

  constructor(events: EventManager, seasonService: ISeasonService) {
    this.events = events;
    this.seasonService = seasonService;
  }

  start(intervalInMS: number = defaultInterval): void {
    this.timerId = setTimeout(async function callback() {

    }, intervalInMS)
  }

  async getCompetition(code: string = championsLeague): Promise<void> {
    const competition = await getCompetition(code);
    await this.seasonService.save(competition.currentSeason);
  }

  updateCompetition(competition: ICompetition): void {}

  updateMatch(match: any): void {}

  updateMatches(matches: any): void {}

  updateSeason(season: any): void {}
}
