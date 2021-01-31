import { ObjectId } from 'mongodb';
import { IMongoId } from '../types/Base';
import { IService } from './IService';
import { ICommonDao } from './ICommonDao';

abstract class AbstractService<E extends IMongoId> implements IService<E> {
  abstract getDao(): ICommonDao<E>;

  getByMongoId(id: ObjectId): Promise<E | null> {
    return this.getDao().getByMongoId(id);
  }

  getById(id: number | string): Promise<E | null> {
    return this.getDao().getById(id);
  }

  save(entity: E): Promise<void> {
    return this.getDao().save(entity);
  }

  updateEntity(entity: E): Promise<void> {
    return this.getDao().update(entity);
  }

  getAll(): Promise<E[]> {
    return this.getDao().getAll();
  }

  insertMany(docs: E[]): Promise<number> {
    return this.getDao().insertMany(docs);
  }

  replaceMany(docs: E[]): Promise<void> {
    return this.getDao().replaceMany(docs);
  }
}

export default AbstractService;
