import { IMongoIdNum } from '../types/Base';

export interface IService<E extends IMongoIdNum> {
  save(entity: E): Promise<void>;
  updateEntity(entity: E): Promise<void>;
  get(id: number): Promise<E>;
}
