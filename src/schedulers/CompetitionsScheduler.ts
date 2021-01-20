import { EventManager } from './event-manager';
import { EventType, IScheduler } from '../types/base';
import { Competition, ICompetition } from '../domain/competitions/Competition';
import getCompetition from '../api/football-data-org';
import { API } from '../const';
import { ISeasonService } from '../domain/seasons/SeasonService';
import { ICompetitionService } from '../domain/competitions/CompetitionService';
import { Season } from '../domain/seasons/Season';

const defaultInterval = 24 * 60 * 60 * 1000; // 1 день
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
  getCompetition(code?: string): Promise<void>;
}

export class CompetitionsScheduler implements ICompetitionsScheduler, IScheduler {
  private seasonService: ISeasonService;

  private competitionService: ICompetitionService;

  public events: EventManager;

  // eslint-disable-next-line no-undef
  private timer: NodeJS.Timeout | undefined;

  constructor(
    events: EventManager,
    competitionService: ICompetitionService,
    seasonService: ISeasonService,
  ) {
    this.events = events;
    this.seasonService = seasonService;
    this.competitionService = competitionService;
  }

  start(delayInMs: number = defaultInterval): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const me = this;
    let { timer } = me;
    timer = setTimeout(async function callback() {
      await me.getCompetition();
      // eslint-disable-next-line no-unused-vars
      timer = setTimeout(callback, delayInMs);
    }, delayInMs);
  }

  async getCompetition(code: string = championsLeague): Promise<void> {
    const result = await getCompetition(code);
    if (result) {
      const currentSeason = new Season(result.currentSeason);
      const competition = new Competition({ ...result, currentSeason });
      if (competition.seasons) {
        delete competition.seasons;
      }
      this.events.notify(EventType.GET_COMPETITION, competition);
      this.events.notify(EventType.GET_SEASON, competition);
    }
  }

  updateCompetition(competition: ICompetition): void {}

  updateMatch(match: any): void {}

  updateMatches(matches: any): void {}

  updateSeason(season: any): void {}
}
