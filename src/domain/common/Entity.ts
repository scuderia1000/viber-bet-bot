import { ObjectId } from 'mongodb';
import { IMongoId } from '../types/Base';
import Object from './Object';

class Entity extends Object implements IMongoId {
  _id?: ObjectId;

  protected constructor(id?: ObjectId) {
    super();
    if (id) {
      this._id = id;
    } else {
      this._id = new ObjectId();
    }
  }
}

export default Entity;
