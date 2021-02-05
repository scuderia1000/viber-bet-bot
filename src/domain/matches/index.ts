import { Db } from 'mongodb';
import { IModule } from '../types/Base';
import { MatchService } from './MatchService';
import { IMatchDao, MatchDao } from './MatchDao';
import { CompetitionDao } from '../competitions/CompetitionDao';
import { CompetitionService } from '../competitions/CompetitionService';
import { SeasonDao } from '../seasons/SeasonDao';
import { SeasonService } from '../seasons/SeasonService';

export type IMatchModule = IModule<MatchService, IMatchDao>;

const getMatchModule = (db: Db): IMatchModule => {
  const dao = new MatchDao(db);
  const competitionDao = new CompetitionDao(db);
  const competitionService = new CompetitionService(competitionDao);
  const seasonDao = new SeasonDao(db);
  const seasonService = new SeasonService(seasonDao);
  const service = new MatchService(dao, competitionService, seasonService);

  return {
    service,
    dao,
  };
};

export default getMatchModule;
