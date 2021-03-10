import { IMongoId } from '../types/Base';
import Collection from '../../annotation/Collection';
import Entity from '../common/Entity';

export interface IRoleBase {
  name: string;
  permissions?: string[];
}

export type IRole = IRoleBase & IMongoId;

@Collection('roles')
export class Role extends Entity implements IRole {
  name: string;

  permissions?: string[];

  constructor(props: IRole) {
    super(props._id);
    this.name = props.name;
    this.permissions = props.permissions;
  }

  equals(role: IRole): boolean {
    return this._id === role._id;
  }
}
