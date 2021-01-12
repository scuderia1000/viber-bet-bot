import { Db } from 'mongodb';
import { IRole } from './Role';

const collectionName = 'roles';

export interface IRoleDao {
  getRoleByName(name: string): Promise<IRole | null>;
  getAllRoles(): Promise<IRole[]>;
  saveRole(role: IRole): Promise<void>;
}

export class RoleDao implements IRoleDao {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getRoleByName(name: string): Promise<IRole | null> {
    const role = await this.db.collection<IRole>(collectionName).findOne({ name });
    return role;
  }

  async getAllRoles(): Promise<IRole[]> {
    const cursor = await this.db.collection<IRole>(collectionName).find();
    const roles = await cursor.toArray();
    return roles;
  }

  async saveRole(role: IRole): Promise<void> {
    await this.db.collection<IRole>(collectionName).insertOne(role);
  }
}
