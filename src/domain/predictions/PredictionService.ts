import { ObjectId } from 'mongodb';
import { IPrediction, Prediction } from './Prediction';
import AbstractService from '../common/AbstractService';
import { IPredictionDao } from './PredictionDao';
import { ICommonDao } from '../common/ICommonDao';
import { IService } from '../common/IService';
import { MatchTeamType, MatchTeamTypeMapper } from '../../types/base';

export interface IPredictionService extends IService<IPrediction> {
  getPredictionsByUser(userViberId: string): Promise<Record<string, IPrediction>>;
  saveUserPredictScore(
    userViberId: string,
    matchId: ObjectId,
    matchTeamType: MatchTeamType,
    score: number,
  ): Promise<void>;
  getPredictionsByMatchesIds(
    userViberId: string,
    matchesIds: ObjectId[],
  ): Promise<Record<string, IPrediction>>;
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

  async getPredictionsByUser(userViberId: string): Promise<Record<string, IPrediction>> {
    const result = await this.dao.getPredictionsByUser(userViberId);
    return result;
  }

  async saveUserPredictScore(
    userViberId: string,
    matchId: ObjectId,
    matchTeamType: MatchTeamType,
    score: number,
  ): Promise<void> {
    if (!(userViberId || matchId || matchTeamType || score)) return;

    const matchTeamTypeProperty = MatchTeamTypeMapper[matchTeamType];
    const existPrediction = await this.dao.getUserMatchPrediction(userViberId, matchId);

    if (existPrediction) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (existPrediction.prediction[matchTeamTypeProperty] !== score) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        existPrediction.prediction[matchTeamTypeProperty] = score;
        await this.dao.update(existPrediction);
      }
    } else {
      await this.dao.save(
        new Prediction({
          _id: new ObjectId(),
          userViberId,
          matchId,
          prediction: {
            homeTeam: matchTeamType === MatchTeamType.HOME_TEAM ? score : undefined,
            awayTeam: matchTeamType === MatchTeamType.AWAY_TEAM ? score : undefined,
          },
        }),
      );
    }
  }

  getPredictionsByMatchesIds(
    userViberId: string,
    matchesIds: ObjectId[],
  ): Promise<Record<string, IPrediction>> {
    return this.dao.getPredictionsByMatchesIds(userViberId, matchesIds);
  }
}
