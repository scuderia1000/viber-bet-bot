import { IApiId, IMongoIdNum } from './Base';

abstract class MongoId {
  _id: number;

  protected constructor(props: IMongoIdNum | IApiId) {
    if ('_id' in props) {
      this._id = props._id;
    } else {
      this._id = props.id;
    }
  }
}

export default MongoId;
