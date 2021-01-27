import { ObjectId } from 'mongodb';
import Entity from './Entity';
import { IId } from '../types/Base';

class ViberEntity extends Entity implements IId<string> {
  id?: string;

  constructor(id?: ObjectId, viberId?: string) {
    super(id);
    this.id = viberId;
  }
}

export default ViberEntity;
