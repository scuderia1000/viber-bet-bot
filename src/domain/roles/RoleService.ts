import { ObjectId } from 'mongodb';
import { IRole, Role } from './Role';
import { IRoleDao } from './RoleDao';
import { ROLES } from '../../const';
import { IService } from '../common/IService';
import AbstractService from '../common/AbstractService';
import { ICommonDao } from '../common/ICommonDao';

export interface IRoleService extends IService<IRole> {
  getRoleByName(name: string): Promise<IRole>;
}

export class RoleService extends AbstractService<IRole> implements IRoleService {
  private readonly dao: IRoleDao;

  constructor(dao: IRoleDao) {
    super();
    this.dao = dao;
  }

  async getRoleByName(name: ROLES): Promise<IRole> {
    let role = await this.dao.getRoleByName(name);
    if (!role) {
      role = new Role({ name, _id: new ObjectId() });
      await this.save(role);
    }
    return role;
  }

  getDao(): ICommonDao<IRole> {
    return this.dao;
  }
}
