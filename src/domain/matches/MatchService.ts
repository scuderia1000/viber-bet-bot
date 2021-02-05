import { IService } from '../common/IService';
import { IMatch, Match } from './Match';
import AbstractService from '../common/AbstractService';
import { ICompetitionListeners } from '../../types/base';
import { IMatchDao } from './MatchDao';
import { ICommonDao } from '../common/ICommonDao';
import { ICompetition } from '../competitions/Competition';
import { ICompetitionService } from '../competitions/CompetitionService';
import { MatchStatus } from '../types/Base';
import { ISeasonService } from '../seasons/SeasonService';

export interface IMatchService extends IService<IMatch> {
  getScheduledMatches(competitionCode: string): Promise<IMatch[]>;
}

export class MatchService
  extends AbstractService<IMatch>
  implements IMatchService, ICompetitionListeners {
  private readonly dao: IMatchDao;

  private readonly competitionService: ICompetitionService;

  private readonly seasonService: ISeasonService;

  constructor(
    dao: IMatchDao,
    competitionService: ICompetitionService,
    seasonService: ISeasonService,
  ) {
    super();
    this.dao = dao;
    this.competitionService = competitionService;
    this.seasonService = seasonService;
  }

  getDao(): ICommonDao<IMatch> {
    return this.dao;
  }

  // TODO подумать, как изменить параметр, приходит не объект класса Competition, а просто объект с полями как в Competition
  async update(competitionWithMatches: ICompetition): Promise<void> {
    if (!competitionWithMatches || !competitionWithMatches.matches) return;

    const currentSeason = await this.seasonService.getById(
      competitionWithMatches.matches[0].season.id,
    );

    if (!currentSeason) return;

    const matches = competitionWithMatches.matches.map(
      (match) => new Match({ ...match, season: currentSeason }),
    );
    const existMatches = await this.dao.getMatchesBySeasonId(currentSeason.id);
    await this.updateEntities(existMatches, matches);
  }

  async getScheduledMatches(competitionCode: string): Promise<IMatch[]> {
    const competition = await this.competitionService.getCompetitionByCode(competitionCode);
    if (!competition || !competition.currentSeason._id) return Promise.resolve([]);

    const matches = await this.dao.getSeasonMatchesByStatus(
      competition.currentSeason._id,
      MatchStatus.SCHEDULED,
    );
    return matches;
  }
}
