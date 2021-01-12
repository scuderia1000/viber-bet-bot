import { Db } from 'mongodb';
import { IUserModule, userModule } from './users';

export interface IModules {
  userModule: IUserModule;
}

const getModules = (db: Db): IModules => ({
  userModule: userModule.getUserModule(db),
});

export default getModules;
