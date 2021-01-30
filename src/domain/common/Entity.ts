import { ObjectId } from 'mongodb';
import CommonObject from './CommonObject';
import { IMongoId } from '../types/Base';

class Entity extends CommonObject implements IMongoId {
  _id: ObjectId;

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
