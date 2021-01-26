import { ObjectId } from 'mongodb';
import { IMongoId } from './Base';

abstract class Mongo {
  _id: ObjectId;

  protected constructor(props: IMongoId) {
    if (props._id) {
      this._id = props._id;
    } else {
      this._id = new ObjectId();
    }
  }
}

export default Mongo;
