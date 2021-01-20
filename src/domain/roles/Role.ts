import { ObjectId } from 'mongodb';
import { IBase } from '../types/Base';

export interface IRole extends IBase {
  name: string;
  permissions?: string[];
}

export const Role = (name: string, permissions?: string[], _id?: ObjectId): IRole => ({
  name,
  permissions,
  _id,
});
