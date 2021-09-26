import { ObjectId } from 'mongodb';
import { IMongoId, MatchStatus } from '../types/Base';
import Entity from '../common/Entity';
import Collection from '../../annotation/Collection';
import { Stages } from '../../const';

export interface IUserPrediction {
  homeTeam: number | null;
  awayTeam: number | null;
}

export interface IUserPredictScore {
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
  extraTime: IUserPrediction;
  penalties: IUserPrediction;
}

export interface IBasePrediction {
  userViberId: string;
  matchId: ObjectId;
  score: IUserPredictScore;
  // TODO похоже не используется, проверить
  matchStatus: MatchStatus;
  matchStage: Stages;
  userPredictScore: number | null;
}

export type IPrediction = IBasePrediction & IMongoId;

@Collection('predictions')
export class Prediction extends Entity implements IPrediction {
  matchId: ObjectId;

  userViberId: string;

  score: IUserPredictScore;

  matchStage: Stages;

  matchStatus: MatchStatus;

  userPredictScore: number | null;

  constructor(props: IPrediction) {
    super(props._id);
    this.matchId = props.matchId;
    this.userViberId = props.userViberId;
    this.score = props.score;
    this.matchStage = props.matchStage;
    this.matchStatus = props.matchStatus;
    this.userPredictScore = props.userPredictScore;
  }
}
