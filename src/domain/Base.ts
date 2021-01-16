import { ObjectId } from 'mongodb';

export interface IBase {
  _id?: ObjectId;
}

export interface IIdNum {
  _id: number;
}

export interface IId extends IIdNum {
  id?: number;
}

export interface IError {
  message: string;
}
