import { UserProfile } from 'viber-bot';
import { IId, IMongoId } from '../types/Base';
import Collection from '../../annotation/Collection';
import ViberEntity from '../common/ViberEntity';
import { IRole } from '../roles/Role';
import { LeagueCodes } from '../../const';

export interface IUserBase extends UserProfile {
  roles: IRole[];
  selectedLeagueCode?: LeagueCodes;
  currentRoute?: string;
}

export type IUser = IUserBase & IId<string> & IMongoId;

@Collection('users')
export class User extends ViberEntity implements IUser {
  avatar: string;

  name: string;

  country?: string;

  language?: string;

  roles: IRole[];

  selectedLeagueCode?: LeagueCodes;

  currentRoute?: string;

  constructor(props: IUser) {
    super(props.id, props._id);
    this.avatar = props.avatar;
    this.country = props.country;
    this.language = props.language;
    this.name = props.name;
    this.roles = props.roles;
    this.selectedLeagueCode = props.selectedLeagueCode;
    this.currentRoute = props.currentRoute;
  }

  equals(user: IUser): boolean {
    return this.id === user.id;
  }
}
