import { Db, ObjectId } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IPrediction, Prediction } from './Prediction';
import CRUDDao from '../common/CRUDDao';

export interface IPredictionDao extends ICommonDao<IPrediction> {
  getPredictionsByUser(userViberId: string): Promise<Record<string, IPrediction>>;
  getUserMatchPrediction(userViberId: string, matchId: ObjectId): Promise<IPrediction | null>;
}

export class PredictionDao extends CRUDDao<IPrediction> implements IPredictionDao {
  constructor(db: Db) {
    super(db, Prediction);
  }

  async getPredictionsByUser(userViberId: string): Promise<Record<string, IPrediction>> {
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

  async getUserMatchPrediction(
    userViberId: string,
    matchId: ObjectId,
  ): Promise<IPrediction | null> {
    const query = { userViberId, matchId };
    let result = null;
    const prediction = await this.collection.findOne(query);
    if (prediction) {
      result = new Prediction(prediction);
    }
    return result;
  }
}
