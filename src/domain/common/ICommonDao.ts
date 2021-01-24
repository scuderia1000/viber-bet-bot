import { IMongoIdNum } from '../types/Base';

export interface ICommonDao<E extends IMongoIdNum> {
  save(entity: E): Promise<void>;
  update(entity: E): Promise<void>;
  get(id: number): Promise<E | null>;
}
