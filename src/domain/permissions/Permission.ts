import { ObjectId } from 'mongodb';
import { IMongoId } from '../types/Base';

export interface IPermission extends IMongoId {
  name: string;
  description: string;
}

export const Permission = (_id: ObjectId, name: string, description: string): IPermission => ({
  _id,
  name,
  description,
});
