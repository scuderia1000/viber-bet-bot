import { Db } from 'mongodb';
import { IUserModule, userModule } from './users';
import { competitionModule, ICompetitionModule } from './competitions';
import { ISeasonsModule, seasonsModule } from './seasons';

export interface IModules {
  userModule: IUserModule;
  competitionModule: ICompetitionModule;
  seasonsModule: ISeasonsModule;
}

const getModules = (db: Db): IModules => ({
  userModule: userModule.getUserModule(db),
  competitionModule: competitionModule.getCompetitionModule(db),
  seasonsModule: seasonsModule.getSeasonModule(db),
});

export default getModules;
