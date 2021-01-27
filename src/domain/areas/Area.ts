import { IId, IMongoId, IObject } from '../types/Base';
import ApiEntity from '../common/ApiEntity';

interface IBaseArea {
  name: string;
}

export type IArea = IBaseArea & IId<number> & IMongoId & IObject;

export class Area extends ApiEntity implements IArea {
  name: string;

  constructor(props: IArea) {
    super(props._id, props.id);
    this.name = props.name;
  }

  equals(area: IArea): boolean {
    return this._id === area._id && this.name === area.name;
  }
}
