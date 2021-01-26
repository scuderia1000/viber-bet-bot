import { Db } from 'mongodb';
import { IUser, User } from './User';
import CRUDDao from '../common/CRUDDao';
import { ICommonDao } from '../common/ICommonDao';

export type IUserDao = ICommonDao<IUser>;

export class UserDao extends CRUDDao<IUser> implements IUserDao {
  constructor(db: Db) {
    super(db, User);
  }
}
