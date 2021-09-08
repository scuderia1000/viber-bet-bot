import { Db } from 'mongodb';
import { SeasonService } from './SeasonService';
import { ISeasonDao, SeasonDao } from './SeasonDao';
import { IModule } from '../types/Base';
import { CompetitionService } from '../competitions/CompetitionService';

export type ISeasonsModule = IModule<SeasonService, ISeasonDao>;

const getSeasonModule = (db: Db, competitionService: CompetitionService): ISeasonsModule => {
  const dao = new SeasonDao(db);
  const service = new SeasonService(dao, competitionService);

  return {
    service,
    dao,
  };
};

export default getSeasonModule;
