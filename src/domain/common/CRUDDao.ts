import 'reflect-metadata';
import { Collection, Db, FilterQuery, OptionalId } from 'mongodb';
import { ICommonDao } from './ICommonDao';
import { IMongoId, IMongoIdNum } from '../types/Base';
import logger from '../../util/logger';
import { IRole } from '../roles/Role';

class CRUDDao<E extends IMongoIdNum | IMongoId> implements ICommonDao<E> {
  protected readonly collection: Collection<E>;

  protected readonly db: Db;

  private readonly target: any;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(db: Db, target: any) {
    this.db = db;
    this.target = target;
    this.collection = db.collection(Reflect.getMetadata('collectionName', target));
  }

  async get(id: number): Promise<E | null> {
    const dbResult = await this.collection.findOne({ _id: id } as FilterQuery<E>);
    logger.debug('Get entity is: %s', dbResult);
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

  private toEntity(dbResult: any): E | null {
    let entity: any;
    if (this.target instanceof Function) {
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
