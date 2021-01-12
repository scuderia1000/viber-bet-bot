import { ObjectId } from 'mongodb';
import { IRole, Role } from './Role';
import { IRoleDao } from './RoleDao';
import { ROLES } from '../../const';

export interface IRoleService {
  getRoleByName(name: string): Promise<IRole | null>;
  getAllRoles(): Promise<IRole[]>;
  getRoleUser(): Promise<IRole>;
  saveRole(role: IRole): Promise<void>;
}

export class RoleService implements IRoleService {
  private roleDao: IRoleDao;

  constructor(roleDao: IRoleDao) {
    this.roleDao = roleDao;
  }

  getRoleByName(name: string): Promise<IRole | null> {
    return this.roleDao.getRoleByName(name);
  }

  getAllRoles(): Promise<IRole[]> {
    return this.roleDao.getAllRoles();
  }

  async getRoleUser(): Promise<IRole> {
    let roleUser = await this.roleDao.getRoleByName(ROLES.USER);
    if (!roleUser) {
      roleUser = Role(ROLES.USER, [], new ObjectId());
      await this.saveRole(roleUser);
    }
    return roleUser;
  }

  saveRole(role: IRole): Promise<void> {
    return this.roleDao.saveRole(role);
  }
}
