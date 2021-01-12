import { ObjectId } from 'mongodb';
import { IUser } from './User';
import { IUserDao } from './UserDao';
import { IRoleService } from '../roles/RoleService';
import logger from '../../util/logger';

export interface IUserService {
  saveUser(user: IUser): Promise<void>;
  getUser(id: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
}

export class UserService implements IUserService {
  private userDao: IUserDao;

  private roleService: IRoleService;

  constructor(userDao: IUserDao, roleService: IRoleService) {
    this.userDao = userDao;
    this.roleService = roleService;
  }

  async saveUser(userProfile: IUser): Promise<void> {
    const roleUser = await this.roleService.getRoleUser();
    const roleId = roleUser?._id ?? new ObjectId();
    let user = {
      ...userProfile,
      roles: [roleId],
    };
    const existUser = await this.userDao.getUser(userProfile.id);
    logger.debug('user: %s', user)
    logger.debug('existUser: %s', existUser)
    if (existUser) {
      user = {
        ...user,
        ...existUser,
      };
      logger.debug('updated user: %s', existUser)
    }
    return this.userDao.saveUser(user);
  }

  getAllUsers(): Promise<IUser[]> {
    return this.userDao.getAllUsers();
  }

  getUser(id: string): Promise<IUser | null> {
    return this.userDao.getUser(id);
  }
}
