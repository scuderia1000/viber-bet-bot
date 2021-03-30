import { Cursor, Db, ObjectId } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IPrediction, Prediction } from './Prediction';
import CRUDDao from '../common/CRUDDao';

export interface IPredictionDao extends ICommonDao<IPrediction> {
  predictionsByUser(userViberId: string): Promise<Record<string, IPrediction>>;
  userMatchPrediction(userViberId: string, matchId: ObjectId): Promise<IPrediction | null>;
  predictionsByMatchesIds(
    userViberId: string,
    matchesIds: ObjectId[],
  ): Promise<Record<string, IPrediction>>;
  emptyUsersPredictionsScore(): Promise<Record<string, IPrediction>>;
}

export class PredictionDao extends CRUDDao<IPrediction> implements IPredictionDao {
  constructor(db: Db) {
    super(db, Prediction);
  }

  async predictionsByUser(userViberId: string): Promise<Record<string, IPrediction>> {
    const query = { userViberId };
    const cursor = this.collection.find(query);
    const result: Record<string, IPrediction> = {};

    await cursor.forEach((document) => {
      const prediction = this.toEntity(document);
      if (prediction) {
        result[prediction.matchId.toHexString()] = prediction;
      }
    });
    return result;
  }

  async userMatchPrediction(userViberId: string, matchId: ObjectId): Promise<IPrediction | null> {
    const query = { userViberId, matchId };
    let result = null;
    const prediction = await this.collection.findOne(query);
    if (prediction) {
      result = this.toEntity(prediction);
    }
    return result;
  }

  async predictionsByMatchesIds(
    userViberId: string,
    matchesIds: ObjectId[],
  ): Promise<Record<string, IPrediction>> {
    const query = { userViberId, matchId: { $in: matchesIds } };
    const cursor = this.collection.find(query);
    const result = await this.getPredictionsMap(cursor);

    return result;
  }

  async emptyUsersPredictionsScore(): Promise<Record<string, IPrediction>> {
    const query = { userPredictScore: null };
    const cursor = this.collection.find(query);
    const result = await this.getPredictionsMap(cursor);

    return result;
  }

  async getPredictionsMap(cursor: Cursor): Promise<Record<string, IPrediction>> {
    const result: Record<string, IPrediction> = {};

    await cursor.forEach((document) => {
      const prediction = this.toEntity(document);
      if (prediction) {
        result[prediction.matchId.toHexString()] = prediction;
      }
    });
    return result;
  }
}
