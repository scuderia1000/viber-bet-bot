import { Db } from 'mongodb';
import { CompetitionDao, ICompetitionDao } from './CompetitionDao';
import { CompetitionService, ICompetitionService } from './CompetitionService';

export interface ICompetitionModule {
  competitionService: ICompetitionService;
  competitionDao: ICompetitionDao;
}

const getCompetitionModule = (db: Db): ICompetitionModule => {
  const competitionDao = new CompetitionDao(db);
  const competitionService = new CompetitionService(competitionDao);

  return {
    competitionDao,
    competitionService,
  };
};

export const competitionModule = {
  getCompetitionModule,
};
