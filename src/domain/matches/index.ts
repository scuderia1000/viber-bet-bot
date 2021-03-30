import { Db } from 'mongodb';
import { IModule } from '../types/Base';
import { MatchService } from './MatchService';
import { IMatchDao, MatchDao } from './MatchDao';
import { CompetitionService } from '../competitions/CompetitionService';
import { SeasonService } from '../seasons/SeasonService';
import { TeamService } from '../teams/TeamService';

export type IMatchModule = IModule<MatchService, IMatchDao>;
interface IMatchModuleProps {
  competitionService: CompetitionService;
  seasonService: SeasonService;
  teamService: TeamService;
}

const getMatchModule = (
  db: Db,
  { competitionService, seasonService, teamService }: IMatchModuleProps,
): IMatchModule => {
  const dao = new MatchDao(db);
  const service = new MatchService(dao, competitionService, seasonService, teamService);

  return {
    service,
    dao,
  };
};

export default getMatchModule;
