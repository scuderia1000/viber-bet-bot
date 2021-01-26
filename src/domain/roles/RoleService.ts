import { IRole, Role } from './Role';
import { IRoleDao } from './RoleDao';
import { ROLES } from '../../const';
import { IService } from '../common/IService';
import AbstractService from '../common/AbstractService';
import { ICommonDao } from '../common/ICommonDao';

export interface IRoleService extends IService<IRole> {
  getRoleByName(name: string): Promise<IRole | null>;
  getRoleUser(): Promise<IRole>;
}

export class RoleService extends AbstractService<IRole> implements IRoleService {
  private readonly dao: IRoleDao;

  constructor(dao: IRoleDao) {
    super();
    this.dao = dao;
  }

  getRoleByName(name: string): Promise<IRole | null> {
    return this.dao.getRoleByName(name);
  }

  async getRoleUser(): Promise<IRole> {
    let roleUser = await this.getRoleByName(ROLES.USER);
    if (!roleUser) {
      roleUser = new Role({ name: ROLES.USER });
      await this.save(roleUser);
    }
    return roleUser;
  }

  getDao(): ICommonDao<IRole> {
    return this.dao;
  }
}
