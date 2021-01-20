import { Db } from 'mongodb';
import { ISeason, Season } from './Season';
import logger from '../../util/logger';

const collectionName = 'seasons';

export interface ISeasonDao {
  get(id: number): Promise<ISeason | null>;
  save(season: ISeason): Promise<void>;
  update(season: ISeason): Promise<void>;
}

export class SeasonDao implements ISeasonDao {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async get(id: number): Promise<ISeason | null> {
    let result = null;
    const season = await this.db.collection<ISeason>(collectionName).findOne({ _id: id });
    if (season) {
      result = new Season(season);
    }
    return result;
  }

  async save(season: ISeason): Promise<void> {
    await this.db.collection<ISeason>(collectionName).insertOne(season);
    logger.debug('Successfully save season: %s', season);
  }

  async update(season: ISeason): Promise<void> {
    await this.db.collection<ISeason>(collectionName).replaceOne({ _id: season._id }, season);
    logger.debug('Successfully update season: %s', season);
  }
}
