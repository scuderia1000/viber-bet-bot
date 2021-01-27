import { Db } from 'mongodb';
import { CompetitionDao, ICompetitionDao } from './CompetitionDao';
import { CompetitionService } from './CompetitionService';
import { IModule } from '../types/Base';

export type ICompetitionModule = IModule<CompetitionService, ICompetitionDao>;

const getCompetitionModule = (db: Db): ICompetitionModule => {
  const dao = new CompetitionDao(db);
  const service = new CompetitionService(dao);

  return {
    dao,
    service,
  };
};

export default getCompetitionModule;
