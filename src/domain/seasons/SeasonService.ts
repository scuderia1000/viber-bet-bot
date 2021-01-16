import { ISeason } from './Season';
import { ISeasonDao } from './SeasonDao';
import changeIdProperty from '../../util/changeIdProperty';
import logger from '../../util/logger';

export interface ISeasonService {
  get(id: number): Promise<ISeason | null>;
  save(season: ISeason): Promise<void>;
}

export class SeasonService implements ISeasonService {
  private seasonDao: ISeasonDao;

  constructor(seasonDao: ISeasonDao) {
    this.seasonDao = seasonDao;
  }

  get(id: number): Promise<ISeason | null> {
    return this.seasonDao.get(id);
  }

  async save(season: ISeason): Promise<void> {
    // eslint-disable-next-line no-prototype-builtins
    if (season && season.hasOwnProperty('id')) {
      changeIdProperty(season);
    }
    logger.debug('changed id season: %s', season);
    const existSeason = await this.get(season._id);
    if (!existSeason || JSON.stringify(existSeason) !== JSON.stringify(season)) {
      await this.seasonDao.save(season);
    }
  }
}
