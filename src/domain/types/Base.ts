import { ObjectId } from 'mongodb';

export interface IBase {
  _id?: ObjectId;
}

export interface IMongoIdNum {
  _id: number;
}

export interface IId extends IMongoIdNum {
  id?: number;
}

export interface IError {
  message: string;
}

export interface IApiId {
  id: number;
}

export interface IObject {
  equals(instance: any): boolean;
}
