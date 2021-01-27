import { UserProfile } from 'viber-bot';
import { ObjectId } from 'mongodb';
import { IId, IMongoId, IObject } from '../types/Base';
import Collection from '../../annotation/Collection';
import ViberEntity from '../common/ViberEntity';

export interface IUserBase extends Omit<UserProfile, 'id'> {
  roles?: ObjectId[];
}

export type IUser = IUserBase & IId<string> & IMongoId & IObject;

@Collection('users')
export class User extends ViberEntity implements IUser {
  avatar: string;

  name: string;

  country?: string;

  language?: string;

  roles?: ObjectId[];

  constructor(props: IUser) {
    super(props._id, props.id);
    this.avatar = props.avatar;
    this.country = props.country;
    this.language = props.language;
    this.name = props.name;
    this.roles = props.roles;
  }

  equals(user: IUser): boolean {
    return this.id === user.id;
  }
}
