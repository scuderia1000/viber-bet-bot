import { IUser } from '../model/User';
import { IUserDao } from '../dao/UserDao';

export interface IUserService {
  saveUser(user: IUser): Promise<void>;
}

export class UserService implements IUserService {
  private userDao: IUserDao;

  constructor(userDao: IUserDao) {
    this.userDao = userDao;
  }

  async saveUser(user: IUser): Promise<void> {
    await this.userDao.saveUser(user);
  }
}
