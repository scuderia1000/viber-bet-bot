import { Db } from 'mongodb';
import { IUser } from './User';
import logger from '../../util/logger';

const collectionName = 'users';

export interface IUserDao {
  saveUser(user: IUser): Promise<void>;
  getUser(id: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  replaceUser(user: IUser): Promise<void>;
}

export class UserDao implements IUserDao {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async saveUser(user: IUser): Promise<void> {
    await this.db.collection<IUser>(collectionName).insertOne(user);
    logger.debug('Successfully save user: %s', user);
  }

  async getAllUsers(): Promise<IUser[]> {
    const cursor = await this.db.collection<IUser>(collectionName).find();
    const results = await cursor.toArray();
    return results;
  }

  async getUser(id: string): Promise<IUser | null> {
    const user = await this.db.collection<IUser>(collectionName).findOne({ id });
    return user;
  }

  async replaceUser(user: IUser): Promise<void> {
    await this.db.collection<IUser>(collectionName).replaceOne({ id: user.id }, user);
    logger.debug('Successfully update user: %s', user);
  }
}
