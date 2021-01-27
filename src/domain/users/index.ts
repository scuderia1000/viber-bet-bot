import { Db } from 'mongodb';
import { IUserService, UserService } from './UserService';
import { IUserDao, UserDao } from './UserDao';
import { RoleDao } from '../roles/RoleDao';
import { RoleService } from '../roles/RoleService';
import { IModule } from '../types/Base';

export type IUserModule = IModule<IUserService, IUserDao>;

const getUserModule = (db: Db): IUserModule => {
  const dao = new UserDao(db);
  const roleDao = new RoleDao(db);
  const roleService = new RoleService(roleDao);
  const service = new UserService(dao, roleService);

  return {
    dao,
    service,
  };
};

export default getUserModule;
