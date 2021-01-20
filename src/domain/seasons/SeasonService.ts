import { ISeason } from './Season';
import { ISeasonDao } from './SeasonDao';
import changeIdProperty from '../../util/changeIdProperty';
import { ICompetitionListeners } from '../../types/base';
import { ICompetition } from '../competitions/Competition';

export interface ISeasonService {
  get(id: number): Promise<ISeason | null>;
  save(season: ISeason): Promise<void>;
  updateSeason(season: ISeason): Promise<void>;
  isSeasonsEqual(seasonOne: ISeason, seasonTwo: ISeason): boolean;
}

export class SeasonService implements ISeasonService, ICompetitionListeners {
  private seasonDao: ISeasonDao;

  constructor(seasonDao: ISeasonDao) {
    this.seasonDao = seasonDao;
  }

  get(id: number): Promise<ISeason | null> {
    return this.seasonDao.get(id);
  }

  save(season: ISeason): Promise<void> {
    return this.seasonDao.save(season);
  }

  updateSeason(season: ISeason): Promise<void> {
    return this.seasonDao.update(season);
  }

  async update(competition: ICompetition): Promise<void> {
    if (!competition) return;

    const { currentSeason } = competition;
    currentSeason.competitionId = competition._id;
    const existSeason = await this.get(currentSeason._id);
    if (!existSeason) {
      await this.save(currentSeason);
    } else if (!currentSeason.equals(existSeason)) {
      await this.updateSeason(currentSeason);
    }
  }

  isSeasonsEqual = (seasonOne: ISeason, seasonTwo: ISeason): boolean =>
    seasonOne._id === seasonTwo._id &&
    seasonOne.startDate === seasonTwo.startDate &&
    seasonOne.endDate === seasonTwo.endDate;
}
