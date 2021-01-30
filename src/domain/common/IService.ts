import { ObjectId } from 'mongodb';
import { IMongoId } from '../types/Base';

export interface IService<E extends IMongoId> {
  save(entity: E): Promise<void>;
  updateEntity(entity: E): Promise<void>;
  getById(id: number | string): Promise<E | null>;
  getByMongoId(id: ObjectId): Promise<E | null>;
  getAll(): Promise<E[]>;
}
