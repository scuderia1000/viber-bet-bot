import { Db } from 'mongodb';
import { IUserService, UserService } from './UserService';
import { IUserDao, UserDao } from './UserDao';
import { IModule } from '../types/Base';
import { IRoleService } from '../roles/RoleService';

export type IUserModule = IModule<IUserService, IUserDao>;

const getUserModule = (db: Db, roleService: IRoleService): IUserModule => {
  const dao = new UserDao(db);
  const service = new UserService(dao, roleService);

  return {
    dao,
    service,
  };
};

export default getUserModule;
