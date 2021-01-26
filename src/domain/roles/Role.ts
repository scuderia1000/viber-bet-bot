import { IMongoId, IObject } from '../types/Base';
import Mongo from '../types/Mongo';
import Collection from '../../annotation/Collection';

export interface IRoleBase extends IMongoId {
  name: string;
  permissions?: string[];
}

export type IRole = IRoleBase & IMongoId;

@Collection('roles')
export class Role extends Mongo implements IRole, IObject {
  name: string;

  permissions?: string[];

  constructor(props: IRole) {
    super(props);
    this.name = props.name;
    this.permissions = props.permissions;
  }

  equals(role: IRole): boolean {
    return this._id === role._id;
  }
}
