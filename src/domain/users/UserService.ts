import { ObjectId } from 'mongodb';
import { IUser } from './User';
import { IUserDao } from './UserDao';
import { IRoleService } from '../roles/RoleService';
import { IService } from '../common/IService';
import AbstractService from '../common/AbstractService';
import { ICommonDao } from '../common/ICommonDao';

export type IUserService = IService<IUser>;

export class UserService extends AbstractService<IUser> implements IUserService {
  private readonly dao: IUserDao;

  private roleService: IRoleService;

  constructor(dao: IUserDao, roleService: IRoleService) {
    super();
    this.dao = dao;
    this.roleService = roleService;
  }

  async saveUser(userProfile: IUser): Promise<void> {
    const roleUser = await this.roleService.getRoleUser();
    const roleId = roleUser?._id ?? new ObjectId();
    let user = {
      ...userProfile,
      roles: [roleId],
    };
    const existUser = await this.dao.getUser(userProfile.id);
    if (existUser) {
      user = {
        ...user,
        ...existUser,
      };
      return this.replaceUser(user);
    }
    return this.dao.saveUser(user);
  }

  getDao(): ICommonDao<IUser> {
    return this.dao;
  }
}
