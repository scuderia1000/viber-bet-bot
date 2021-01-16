import { Db } from 'mongodb';
import { ISeason } from './Season';
import logger from '../../util/logger';

const collectionName = 'seasons';

export interface ISeasonDao {
  get(id: number): Promise<ISeason | null>;
  save(season: ISeason): Promise<void>;
}

export class SeasonDao implements ISeasonDao {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(id: number): Promise<ISeason | null> {
    const result = await this.db.collection<ISeason>(collectionName).findOne({ _id: id });
    return result;
  }

  async save(season: ISeason): Promise<void> {
    await this.db.collection<ISeason>(collectionName).insertOne(season);
    logger.debug('Successfully save season: %s', season);
  }
}
