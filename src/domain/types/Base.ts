import { ObjectId } from 'mongodb';
import { IService } from '../common/IService';
import { ICommonDao } from '../common/ICommonDao';

export interface IId<T> {
  id: T;
}

export interface IMongoId {
  _id: ObjectId;
}

export interface IModule<S extends IService<any>, D extends ICommonDao<any>> {
  service: S;
  dao: D;
}

export interface IError {
  message: string;
}

export interface IObject {
  equals(object: any): boolean;
}

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  IN_PLAY = 'IN_PLAY',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
  POSTPONED = 'POSTPONED',
  SUSPENDED = 'SUSPENDED',
  CANCELED = 'CANCELED',
}

export type DateTimeISOString = string;

export enum Winner {
  AWAY_TEAM = 'AWAY_TEAM',
  HOME_TEAM = 'HOME_TEAM',
}

export enum PlayerRole {
  PLAYER = 'PLAYER',
  COACH = 'COACH',
}

export interface ICollectionName {
  collectionName: string;
}
