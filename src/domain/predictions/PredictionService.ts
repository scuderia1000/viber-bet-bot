import { ObjectId } from 'mongodb';
import { IPrediction, Prediction } from './Prediction';
import AbstractService from '../common/AbstractService';
import { IPredictionDao } from './PredictionDao';
import { ICommonDao } from '../common/ICommonDao';
import { IService } from '../common/IService';
import { MatchTeamType } from '../../types/base';
import { FinalPartPredictionStages } from '../../const';

export interface IPredictionService extends IService<IPrediction> {
  getPredictionsByUser(userViberId: string): Promise<Record<string, IPrediction>>;
  saveUserPredictScore(
    userViberId: string,
    matchId: ObjectId,
    matchTeamType: MatchTeamType,
    score: number,
    predictStage?: FinalPartPredictionStages,
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
    predictStage?: FinalPartPredictionStages,
  ): Promise<void> {
    if (!(userViberId || matchId || matchTeamType || score)) return;

    const existPrediction = await this.dao.getUserMatchPrediction(userViberId, matchId);

    if (existPrediction) {
      if (!predictStage) {
        existPrediction.score.regularTime[matchTeamType] = score;
        existPrediction.score.fullTime[matchTeamType] = score;
      } else {
        const existStageScore = existPrediction.score[predictStage];
        existStageScore[matchTeamType] = score;

        existPrediction.score.fullTime[matchTeamType] =
          Number(existPrediction.score.regularTime[matchTeamType]) +
          Number(existPrediction.score.extraTime[matchTeamType]) +
          Number(existPrediction.score.penalties[matchTeamType]);
      }
      await this.dao.update(existPrediction);
    } else {
      await this.dao.save(
        new Prediction({
          _id: new ObjectId(),
          userViberId,
          matchId,
          score: {
            regularTime: {
              homeTeam: matchTeamType === MatchTeamType.HOME_TEAM ? score : null,
              awayTeam: matchTeamType === MatchTeamType.AWAY_TEAM ? score : null,
            },
            fullTime: {
              homeTeam: matchTeamType === MatchTeamType.HOME_TEAM ? score : null,
              awayTeam: matchTeamType === MatchTeamType.AWAY_TEAM ? score : null,
            },
            halfTime: {
              homeTeam: null,
              awayTeam: null,
            },
            extraTime: {
              homeTeam: null,
              awayTeam: null,
            },
            penalties: {
              homeTeam: null,
              awayTeam: null,
            },
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
