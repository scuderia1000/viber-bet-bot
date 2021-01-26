import { UserProfile } from 'viber-bot';
import { ObjectId } from 'mongodb';
import { IMongoId, IObject, IViberApiId } from '../types/Base';
import Mongo from '../types/Mongo';
import Collection from '../../annotation/Collection';

export interface IUserBase extends Omit<UserProfile, 'id'> {
  viberId?: string;
  roles?: ObjectId[];
}

export type IUser = IUserBase & IMongoId;
export type IApiUser = IUserBase & IViberApiId;

@Collection('users')
export class User extends Mongo implements IUser, IObject {
  avatar: string;

  name: string;

  viberId?: string;

  country?: string;

  language?: string;

  roles?: ObjectId[];

  constructor(props: IUser | IApiUser) {
    super(props as IUser);
    this.avatar = props.avatar;
    this.country = props.country;
    this.language = props.language;
    this.name = props.name;
    this.roles = props.roles;
    if ('id' in props) {
      this.viberId = props.id;
    }
  }

  equals(user: IUser | IApiUser): boolean {
    return this.viberId === (user as IApiUser)?.id;
  }
}
