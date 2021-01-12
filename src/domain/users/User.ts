import { UserProfile } from 'viber-bot';
import { ObjectId } from 'mongodb';
import { IBase } from '../Base';

export interface IUser extends UserProfile, IBase {
  roles?: ObjectId[];
}

export const User = (
  id: string,
  name: string,
  avatar: string,
  roles?: ObjectId[],
  country?: string,
  language?: string,
): IUser => ({
  id,
  name,
  avatar,
  country,
  language,
  roles,
});
