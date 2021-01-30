import { Db } from 'mongodb';
import { IUser, User } from './User';
import CRUDDao from '../common/CRUDDao';
import { ICommonDao } from '../common/ICommonDao';
import { IAdmin } from '../admins/Admin';

export interface IUserDao extends ICommonDao<IUser> {
  getViberAdminsIds(): Promise<string[]>;
}

export class UserDao extends CRUDDao<IUser> implements IUserDao {
  constructor(db: Db) {
    super(db, User);
  }

  async getViberAdminsIds(): Promise<string[]> {
    const cursor = await this.db.collection('admins').find();
    const result = (await cursor.toArray()) as IAdmin[];
    return result.map((adminItem) => adminItem.userViberId);
  }
}
