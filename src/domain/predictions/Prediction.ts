import { ObjectId } from 'mongodb';
import { IMongoId } from '../types/Base';
import Entity from '../common/Entity';
import Collection from '../../annotation/Collection';

export interface IUserPrediction {
  homeTeam?: number;
  awayTeam?: number;
}

export interface IBasePrediction {
  userViberId: string;
  matchId: ObjectId;
  prediction: IUserPrediction;
}

export type IPrediction = IBasePrediction & IMongoId;

@Collection('predictions')
export class Prediction extends Entity implements IPrediction {
  matchId: ObjectId;

  prediction: IUserPrediction;

  userViberId: string;

  constructor(props: IPrediction) {
    super(props._id);
    this.matchId = props.matchId;
    this.prediction = props.prediction;
    this.userViberId = props.userViberId;
  }
}
