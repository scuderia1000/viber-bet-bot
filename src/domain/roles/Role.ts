import { IId, IMongoId, IObject } from '../types/Base';
import Collection from '../../annotation/Collection';
import ViberEntity from '../common/ViberEntity';

export interface IRoleBase extends IMongoId {
  name: string;
  permissions?: string[];
}

export type IRole = IRoleBase & IId<string> & IMongoId;

@Collection('roles')
export class Role extends ViberEntity implements IRole {
  name: string;

  permissions?: string[];

  constructor(props: IRole) {
    super(props._id, props.id);
    this.name = props.name;
    this.permissions = props.permissions;
  }

  equals(role: IRole): boolean {
    return this._id === role._id;
  }
}
