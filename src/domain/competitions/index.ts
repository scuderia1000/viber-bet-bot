import { Db } from 'mongodb';
import { CompetitionDao, ICompetitionDao } from './CompetitionDao';
import { CompetitionService } from './CompetitionService';

export interface ICompetitionModule {
  competitionService: CompetitionService;
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
