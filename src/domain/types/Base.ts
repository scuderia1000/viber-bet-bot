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
