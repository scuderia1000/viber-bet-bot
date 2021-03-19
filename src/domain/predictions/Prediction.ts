import { ObjectId } from 'mongodb';
import { IMongoId } from '../types/Base';
import Entity from '../common/Entity';
import Collection from '../../annotation/Collection';

export interface IUserPrediction {
  homeTeam: number | null;
  awayTeam: number | null;
}

interface IUserPredictScore {
  /**
   * Общий счет матча
   * regularTime + halfTime + extraTime + penalties
   */
  fullTime: IUserPrediction;
  /**
   * Основное время
   */
  regularTime: IUserPrediction;
  halfTime?: IUserPrediction;
  extraTime?: IUserPrediction;
  penalties?: IUserPrediction;
}

export interface IBasePrediction {
  userViberId: string;
  matchId: ObjectId;
  score: IUserPredictScore;
}

export type IPrediction = IBasePrediction & IMongoId;

@Collection('predictions')
export class Prediction extends Entity implements IPrediction {
  matchId: ObjectId;

  userViberId: string;

  score: IUserPredictScore;

  constructor(props: IPrediction) {
    super(props._id);
    this.matchId = props.matchId;
    this.userViberId = props.userViberId;
    this.score = props.score;
  }
}
