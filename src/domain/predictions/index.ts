import { Db } from 'mongodb';
import { IModule } from '../types/Base';
import { PredictionService } from './PredictionService';
import { IPredictionDao, PredictionDao } from './PredictionDao';
import { IMatchService } from '../matches/MatchService';

export type IPredictionModule = IModule<PredictionService, IPredictionDao>;

const getPredictionModule = (db: Db, matchService: IMatchService): IPredictionModule => {
  const dao = new PredictionDao(db);
  const service = new PredictionService(dao, matchService);

  return {
    dao,
    service,
  };
};

export default getPredictionModule;
