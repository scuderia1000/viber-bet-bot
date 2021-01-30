import { ISeason } from './Season';
import { ISeasonDao } from './SeasonDao';
import { ICompetitionListeners } from '../../types/base';
import { ICompetition } from '../competitions/Competition';
import AbstractService from '../common/AbstractService';
import { IService } from '../common/IService';
import { ICommonDao } from '../common/ICommonDao';

export type ISeasonService = IService<ISeason>;

export class SeasonService
  extends AbstractService<ISeason>
  implements ISeasonService, ICompetitionListeners {
  private readonly dao: ISeasonDao;

  constructor(seasonDao: ISeasonDao) {
    super();
    this.dao = seasonDao;
  }

  async update(competition: ICompetition): Promise<void> {
    if (!competition) return;

    const { currentSeason } = competition;

    if (!currentSeason.id) return;

    currentSeason.competitionId = competition._id;
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
