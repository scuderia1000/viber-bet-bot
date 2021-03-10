import { Db } from 'mongodb';
import { IModule } from '../types/Base';
import { MatchService } from './MatchService';
import { IMatchDao, MatchDao } from './MatchDao';
import { CompetitionDao } from '../competitions/CompetitionDao';
import { CompetitionService } from '../competitions/CompetitionService';
import { SeasonDao } from '../seasons/SeasonDao';
import { SeasonService } from '../seasons/SeasonService';
import { TeamDao } from '../teams/TeamDao';
import { TeamService } from '../teams/TeamService';

export type IMatchModule = IModule<MatchService, IMatchDao>;

const getMatchModule = (db: Db): IMatchModule => {
  const dao = new MatchDao(db);
  const competitionDao = new CompetitionDao(db);
  const competitionService = new CompetitionService(competitionDao);
  const seasonDao = new SeasonDao(db);
  const seasonService = new SeasonService(seasonDao);
  const teamDao = new TeamDao(db);
  const teamService = new TeamService(teamDao);
  const service = new MatchService(dao, competitionService, seasonService, teamService);

  return {
    service,
    dao,
  };
};

export default getMatchModule;
