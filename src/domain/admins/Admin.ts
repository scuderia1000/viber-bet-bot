import { IMongoId } from '../types/Base';
import Entity from '../common/Entity';

export interface IAdmin extends IMongoId {
  userViberId: string;
}

export class Admin extends Entity implements IAdmin {
  userViberId: string;

  constructor(props: IAdmin) {
    super(props._id);
    this.userViberId = props.userViberId;
  }
}
