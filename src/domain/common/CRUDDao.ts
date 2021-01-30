import 'reflect-metadata';
import { Collection, Db, FilterQuery, ObjectId, OptionalId } from 'mongodb';
import { ICommonDao } from './ICommonDao';
import { IMongoId } from '../types/Base';
import logger from '../../util/logger';

class CRUDDao<E extends IMongoId> implements ICommonDao<E> {
  protected readonly collection: Collection<E>;

  protected readonly db: Db;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly target: any;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  constructor(db: Db, target: any) {
    this.db = db;
    this.target = target;
    this.collection = db.collection(Reflect.getMetadata('collectionName', target));
  }

  async getByMongoId(id: ObjectId): Promise<E | null> {
    const dbResult = await this.collection.findOne({ _id: id } as FilterQuery<E>);
    logger.debug('getByMongoId entity is: %s', dbResult);
    return this.toEntity(dbResult);
  }

  async getById(id: number | string): Promise<E | null> {
    const dbResult = await this.collection.findOne({ id } as FilterQuery<E>);
    logger.debug('getById: %s entity is: %s', id, dbResult);
    return this.toEntity(dbResult);
  }

  async save(entity: E): Promise<void> {
    await this.collection.insertOne(entity as OptionalId<E>);
    logger.debug('Successfully save entity: %s', entity);
  }

  async update(entity: E): Promise<void> {
    await this.collection.replaceOne({ _id: entity._id } as FilterQuery<E>, entity);
    logger.debug('Successfully update entity: %s', entity);
  }

  toEntity(dbResult: any): E | null {
    let entity: any;
    if (dbResult && this.target instanceof Function) {
      entity = new (<any>this.target)(dbResult);
      return entity;
    }

    return null;
  }

  async getAll(): Promise<E[]> {
    const cursor = await this.collection.find();
    const result = await cursor.toArray();
    return result;
  }
}

export default CRUDDao;
