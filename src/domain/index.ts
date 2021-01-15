import { Db } from 'mongodb';
import { IUserModule, userModule } from './users';
import { competitionModule, ICompetitionModule } from './competitions';

export interface IModules {
  userModule: IUserModule;
  competitionModule: ICompetitionModule;
}

const getModules = (db: Db): IModules => ({
  userModule: userModule.getUserModule(db),
  competitionModule: competitionModule.getCompetitionModule(db),
});

export default getModules;
