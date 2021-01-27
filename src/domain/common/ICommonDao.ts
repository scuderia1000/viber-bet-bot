import { IMongoId } from '../types/Base';

export interface ICommonDao<E extends IMongoId> {
  save(entity: E): Promise<void>;
  update(entity: E): Promise<void>;
  get(id: number): Promise<E | null>;
  getAll(): Promise<E[]>;
}
