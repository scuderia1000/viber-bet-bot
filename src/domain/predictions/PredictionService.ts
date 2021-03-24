import { ObjectId } from 'mongodb';
import { IPrediction, Prediction } from './Prediction';
import AbstractService from '../common/AbstractService';
import { IPredictionDao } from './PredictionDao';
import { ICommonDao } from '../common/ICommonDao';
import { IService } from '../common/IService';
import { ICompetitionListeners, MatchTeamType } from '../../types/base';
import { FinalPartPredictionStages } from '../../const';
import { IMatch } from '../matches/Match';
import { ICompetition } from '../competitions/Competition';

export interface IPredictionService extends IService<IPrediction> {
  getPredictionsByUser(userViberId: string): Promise<Record<string, IPrediction>>;
  saveUserPredictScore(
    userViberId: string,
    match: IMatch,
    matchTeamType: MatchTeamType,
    score: number,
    predictStage?: FinalPartPredictionStages,
  ): Promise<void>;
  getPredictionsByMatchesIds(
    userViberId: string,
    matchesIds: ObjectId[],
  ): Promise<Record<string, IPrediction>>;
}

export class PredictionService
  extends AbstractService<IPrediction>
  implements IPredictionService, ICompetitionListeners {
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
    match: IMatch,
    matchTeamType: MatchTeamType,
    score: number,
    predictStage?: FinalPartPredictionStages,
  ): Promise<void> {
    if (!(userViberId || match || matchTeamType || score)) return;

    const existPrediction = await this.dao.getUserMatchPrediction(userViberId, match._id);

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
          matchId: match._id,
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
          matchStage: match.stage,
          matchStatus: match.status,
          userPredictScore: null,
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

  async update(competitionWithMatches: ICompetition): Promise<void> {
    if (!competitionWithMatches || !competitionWithMatches.matches) return;

    // const predictions
  }
}
