import { IBase } from '../types/Base';

export interface IPermission extends IBase {
  name: string;
  description: string;
}

export const Permission = (name: string, description: string): IPermission => ({
  name,
  description,
});
