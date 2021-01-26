import { IMongoId } from '../types/Base';

export interface IPermission extends IMongoId {
  name: string;
  description: string;
}

export const Permission = (name: string, description: string): IPermission => ({
  name,
  description,
});
