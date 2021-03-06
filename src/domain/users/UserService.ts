import { UserProfile } from 'viber-bot';
import { ObjectId } from 'mongodb';
import { IUser, User } from './User';
import { IUserDao } from './UserDao';
import { IRoleService } from '../roles/RoleService';
import { IService } from '../common/IService';
import AbstractService from '../common/AbstractService';
import { ICommonDao } from '../common/ICommonDao';
import { LeagueCodes, ROLES } from '../../const';

export interface IUserService extends IService<IUser> {
  saveViberUser(user: UserProfile): Promise<void>;
  setLeague(userViberId: string, leagueCode: LeagueCodes): Promise<void>;
}

export class UserService extends AbstractService<IUser> implements IUserService {
  private readonly dao: IUserDao;

  private roleService: IRoleService;

  constructor(dao: IUserDao, roleService: IRoleService) {
    super();
    this.dao = dao;
    this.roleService = roleService;
  }

  async saveViberUser(userProfile: UserProfile): Promise<void> {
    if (!userProfile.id) return;

    const roles = [];
    const roleUser = await this.roleService.getRoleByName(ROLES.USER);
    roles.push(roleUser);

    const viberAdminsIds = await this.dao.getViberAdminsIds();
    if (viberAdminsIds.includes(userProfile.id)) {
      const roleAdmin = await this.roleService.getRoleByName(ROLES.ADMIN);
      roles.push(roleAdmin);
    }
    const user = new User({ ...userProfile, roles, _id: new ObjectId() });

    const existUser = await this.getById(userProfile.id);
    if (!existUser) {
      await this.save(user);
    }
  }

  getDao(): ICommonDao<IUser> {
    return this.dao;
  }

  async setLeague(userViberId: string, leagueCode: LeagueCodes): Promise<void> {
    const user = await this.dao.getById(userViberId);
    if (!user) return;

    if (user.selectedLeagueCode !== leagueCode) {
      user.selectedLeagueCode = leagueCode;
      await this.dao.update(user);
    }
  }
}
