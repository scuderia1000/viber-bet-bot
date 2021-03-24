import { Db } from 'mongodb';
import { IModule } from '../types/Base';
import { PredictionService } from './PredictionService';
import { IPredictionDao, PredictionDao } from './PredictionDao';

export type IPredictionModule = IModule<PredictionService, IPredictionDao>;

const getPredictionModule = (db: Db): IPredictionModule => {
  const dao = new PredictionDao(db);
  const service = new PredictionService(dao);

  return {
    dao,
    service,
  };
};

export default getPredictionModule;
