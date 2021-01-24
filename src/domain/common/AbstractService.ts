import { IMongoIdNum } from '../types/Base';
import { IService } from './IService';
import { ICommonDao } from './ICommonDao';

abstract class AbstractService<E extends IMongoIdNum> implements IService<E> {
  abstract getDao(): ICommonDao<E>;

  get(id: number): Promise<E> {
    return this.getDao().get(id);
  }

  save(entity: E): Promise<void> {
    return this.getDao().save(entity);
  }

  updateEntity(entity: E): Promise<void> {
    return this.getDao().update(entity);
  }
}

export default AbstractService;
