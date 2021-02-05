import { ObjectId } from 'mongodb';
import Entity from './Entity';
import { IId } from '../types/Base';

class ApiEntity extends Entity implements IId<number> {
  id: number;

  constructor(apiId: number, id?: ObjectId) {
    super(id);
    this.id = apiId;
  }
}

export default ApiEntity;
