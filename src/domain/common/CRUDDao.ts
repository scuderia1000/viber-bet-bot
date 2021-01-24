import { Collection, Db, FilterQuery, OptionalId } from 'mongodb';
import { ICommonDao } from './ICommonDao';
import { IMongoIdNum } from '../types/Base';
import logger from '../../util/logger';
import 'reflect-metadata';

class CRUDDao<E extends IMongoIdNum> implements ICommonDao<E> {
  protected readonly collection: Collection<E>;

  private readonly db: Db;

  constructor(db: Db) {
    this.db = db;
    this.collection = db.collection(Reflect.getMetadata('collectionName', this));
    console.log('CRUDDao collectionName', Reflect.getMetadata('collectionName', this));
  }

  async get(id: number): Promise<E | null> {
    const result = await this.collection.findOne({ _id: id } as FilterQuery<E>);
    return result;
  }

  async save(entity: E): Promise<void> {
    await this.collection.insertOne(entity as OptionalId<E>);
    logger.debug('Successfully save competition: %s', entity);
  }

  async update(entity: E): Promise<void> {
    await this.collection.replaceOne({ _id: entity._id } as FilterQuery<E>, entity);
    logger.debug('Successfully update competition: %s', entity);
  }
}

export default CRUDDao;
