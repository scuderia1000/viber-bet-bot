import { Db } from 'mongodb';
import { SeasonService } from './SeasonService';
import { ISeasonDao, SeasonDao } from './SeasonDao';

export interface ISeasonsModule {
  seasonService: SeasonService;
  seasonDao: ISeasonDao;
}

const getSeasonModule = (db: Db): ISeasonsModule => {
  const seasonDao = new SeasonDao(db);
  const seasonService = new SeasonService(seasonDao);

  return {
    seasonDao,
    seasonService,
  };
};

export const seasonsModule = {
  getSeasonModule,
};
