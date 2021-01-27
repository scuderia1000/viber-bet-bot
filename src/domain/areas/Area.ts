import { IApiId, IMongoIdNum, IObject } from '../types/Base';
import MongoId from '../types/MongoId';

interface IBaseArea {
  name: string;
}

export type IArea = IBaseArea & IMongoIdNum & IObject;
export type IApiArea = IBaseArea & IApiId;

export class Area extends MongoId implements IArea {
  name: string;

  constructor(props: IArea | IApiArea) {
    super(props);
    this.name = props.name;
  }

  equals(area: IArea): boolean {
    return this._id === area._id && this.name === area.name;
  }
}
