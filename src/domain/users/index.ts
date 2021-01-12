import { Db } from 'mongodb';
import { IUserService, UserService } from './UserService';
import { IUserDao, UserDao } from './UserDao';
import { RoleDao } from '../roles/RoleDao';
import { RoleService } from '../roles/RoleService';

export interface IUserModule {
  userService: IUserService;
  userDao: IUserDao;
}

const getUserModule = (db: Db): IUserModule => {
  const userDao = new UserDao(db);
  const roleDao = new RoleDao(db);
  const roleService = new RoleService(roleDao);
  const userService = new UserService(userDao, roleService);

  return {
    userDao,
    userService,
  };
};

export const userModule = {
  getUserModule,
};
