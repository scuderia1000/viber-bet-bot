import { Db } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IPrediction, Prediction } from './Prediction';
import CRUDDao from '../common/CRUDDao';

export interface IPredictionDao extends ICommonDao<IPrediction> {
  getPredictionsByUser(userViberId: string): Promise<IPrediction | null>;
}

export class PredictionDao extends CRUDDao<IPrediction> implements IPredictionDao {
  constructor(db: Db) {
    super(db, Prediction);
  }

  getPredictionsByUser(userViberId: string): Promise<IPrediction | null> {
    return Promise.resolve(null);
  }
}
