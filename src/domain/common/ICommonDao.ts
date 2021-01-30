import { ObjectId } from 'mongodb';
import { IMongoId } from '../types/Base';

export interface ICommonDao<E extends IMongoId> {
  save(entity: E): Promise<void>;
  update(entity: E): Promise<void>;
  getById(id: number | string): Promise<E | null>;
  getByMongoId(id: ObjectId): Promise<E | null>;
  getAll(): Promise<E[]>;
  toEntity(dbResult: any): E | null;
}
