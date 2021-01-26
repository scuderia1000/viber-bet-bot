import { Db } from 'mongodb';
import { IRole, Role } from './Role';
import { ICommonDao } from '../common/ICommonDao';
import CRUDDao from '../common/CRUDDao';

export interface IRoleDao extends ICommonDao<IRole> {
  getRoleByName(name: string): Promise<IRole | null>;
}

export class RoleDao extends CRUDDao<IRole> implements IRoleDao {
  constructor(db: Db) {
    super(db, Role);
  }

  async getRoleByName(name: string): Promise<IRole | null> {
    const role = await this.collection.findOne({ name });
    return role;
  }
}
