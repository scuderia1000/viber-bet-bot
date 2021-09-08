import { ISeason } from './Season';
import { ISeasonDao } from './SeasonDao';
import { ICompetitionListeners } from '../../types/base';
import { ICompetition } from '../competitions/Competition';
import AbstractService from '../common/AbstractService';
import { IService } from '../common/IService';
import { ICommonDao } from '../common/ICommonDao';
import logger from '../../util/logger';
import { ICompetitionService } from '../competitions/CompetitionService';

export type ISeasonService = IService<ISeason>;

export class SeasonService
  extends AbstractService<ISeason>
  implements ISeasonService, ICompetitionListeners {
  private readonly dao: ISeasonDao;

  private readonly competitionService: ICompetitionService;

  constructor(seasonDao: ISeasonDao, competitionService: ICompetitionService) {
    super();
    this.dao = seasonDao;
    this.competitionService = competitionService;
  }

  async update(competition: ICompetition): Promise<void> {
    if (!competition) return;

    const { currentSeason } = competition;

    if (!currentSeason.id) return;
    const existCompetition = await this.competitionService.getById(competition.id);
    currentSeason.competitionId = existCompetition?._id ?? competition._id;
    const existSeason = await this.getById(currentSeason.id);
    if (!existSeason) {
      await this.save(currentSeason);
    } else if (!currentSeason.equals(existSeason)) {
      await this.updateEntity(currentSeason);
    }
  }

  getDao(): ICommonDao<ISeason> {
    return this.dao;
  }
}
