import { IPrediction } from './Prediction';
import AbstractService from '../common/AbstractService';
import { IPredictionDao } from './PredictionDao';
import { ICommonDao } from '../common/ICommonDao';
import { IService } from '../common/IService';

export interface IPredictionService extends IService<IPrediction> {
  getPredictionsByUser(userViberId: string): Promise<IPrediction | null>;
}

export class PredictionService extends AbstractService<IPrediction> implements IPredictionService {
  private readonly dao: IPredictionDao;

  constructor(dao: IPredictionDao) {
    super();
    this.dao = dao;
  }

  getDao(): ICommonDao<IPrediction> {
    return this.dao;
  }

  async getPredictionsByUser(userViberId: string): Promise<IPrediction | null> {
    const result = await this.dao.getPredictionsByUser(userViberId);
    return result;
  }
}
