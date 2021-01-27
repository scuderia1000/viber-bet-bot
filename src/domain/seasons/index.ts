import { Db } from 'mongodb';
import { SeasonService } from './SeasonService';
import { ISeasonDao, SeasonDao } from './SeasonDao';
import { IModule } from '../types/Base';

export type ISeasonsModule = IModule<SeasonService, ISeasonDao>;

const getSeasonModule = (db: Db): ISeasonsModule => {
  const dao = new SeasonDao(db);
  const service = new SeasonService(dao);

  return {
    service,
    dao,
  };
};

export default getSeasonModule;
