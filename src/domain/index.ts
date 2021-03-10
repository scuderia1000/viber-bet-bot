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

const getModules = (db: Db): IModules => ({
  userModule: getUserModule(db),
  competitionModule: getCompetitionModule(db),
  seasonsModule: getSeasonModule(db),
  areaModule: getAreaModule(db),
  teamModule: getTeamModule(db),
  matchModule: getMatchModule(db),
  playerModule: getPlayerModule(db),
  roleModule: getRoleModule(db),
  predictionModule: getPredictionModule(db),
});

export default getModules;
