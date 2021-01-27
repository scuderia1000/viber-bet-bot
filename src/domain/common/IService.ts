import { IMongoId } from '../types/Base';

export interface IService<E extends IMongoId> {
  save(entity: E): Promise<void>;
  updateEntity(entity: E): Promise<void>;
  get(id: number): Promise<E | null>;
  getAll(): Promise<E[]>;
}
