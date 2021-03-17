import { ObjectId } from 'mongodb';
import { IMongoId } from '../types/Base';
import { IService } from './IService';
import { ICommonDao } from './ICommonDao';
import ApiEntity from './ApiEntity';

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

  async updateEntities<D extends ApiEntity>(
    existEntities: Record<number, E>,
    apiEntities: D[],
  ): Promise<void> {
    const newEntities: E[] = [];
    const updateEntities: E[] = [];
    const existEntitiesIds = Object.keys(existEntities);
    if (existEntitiesIds.length) {
      apiEntities.forEach((entity) => {
        if (!entity.id) return;

        if (existEntities[entity.id]) {
          if (!entity.equals(existEntities[entity.id])) {
            // Заменяем _id на существующий в базе, т.к. при создании объекта из api создается новый _id (в api нет этого поля)
            // eslint-disable-next-line no-param-reassign
            entity._id = existEntities[entity.id]._id;
            updateEntities.push((entity as unknown) as E);
          }
        } else {
          newEntities.push((entity as unknown) as E);
        }
      });
      if (updateEntities.length) {
        await this.replaceMany(updateEntities);
      }
      if (newEntities.length) {
        await this.insertMany(newEntities);
      }
    } else {
      await this.insertMany((apiEntities as unknown) as E[]);
    }
  }

  getAllByIds(mongoIds: ObjectId[]): Promise<E[]> {
    return this.getDao().getAllByIds(mongoIds);
  }
}

export default AbstractService;
