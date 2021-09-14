import { Db } from 'mongodb';
import getUserModule, { IUserModule } from './users';
import getCompetitionModule, { ICompetitionModule } from './competitions';
import getSeasonModule, { ISeasonsModule } from './seasons';
import getAreaModule, { IAreaModule } from './areas';
import getTeamModule, { ITeamModule } from './teams';
import getMatchModule, { IMatchModule } from './matches';
import getPlayerModule, { IPlayerModule } from './players';
import getRoleModule, { IRoleModule } from './roles';
import getPredictionModule, { IPredictionModule } from './predictions';

export interface IModules {
  userModule: IUserModule;
  competitionModule: ICompetitionModule;
  seasonsModule: ISeasonsModule;
  areaModule: IAreaModule;
  teamModule: ITeamModule;
  matchModule: IMatchModule;
  playerModule: IPlayerModule;
  roleModule: IRoleModule;
  predictionModule: IPredictionModule;
}

const getModules = (db: Db): IModules => {
  const roleModule = getRoleModule(db);
  const userModule = getUserModule(db, roleModule.service);
  const competitionModule = getCompetitionModule(db);
  const seasonsModule = getSeasonModule(db, competitionModule.service);
  const teamModule = getTeamModule(db);

  const matchModule = getMatchModule(db, {
    competitionService: competitionModule.service,
    seasonService: seasonsModule.service,
    teamService: teamModule.service,
  });
  const predictionModule = getPredictionModule(db, matchModule.service);

  return {
    userModule,
    competitionModule,
    seasonsModule,
    areaModule: getAreaModule(db),
    teamModule,
    matchModule,
    playerModule: getPlayerModule(db),
    roleModule,
    predictionModule,
  };
};

export default getModules;
