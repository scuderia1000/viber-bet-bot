import { ObjectId } from 'mongodb';
import { IMongoId } from '../types/Base';
import ApiEntity from './ApiEntity';

export interface IService<E extends IMongoId> {
  save(entity: E): Promise<void>;
  updateEntity(entity: E): Promise<void>;
  getById(id: number | string): Promise<E | null>;
  getByMongoId(id: ObjectId): Promise<E | null>;
  getAll(): Promise<E[]>;
  insertMany(docs: E[]): Promise<number>;
  replaceMany(docs: E[]): Promise<void>;
  updateEntities<D extends ApiEntity>(
    existEntities: Record<number, E>,
    apiEntities: D[],
  ): Promise<void>;
}
