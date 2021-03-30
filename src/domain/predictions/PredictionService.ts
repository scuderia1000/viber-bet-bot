import { ObjectId } from 'mongodb';
import { IPrediction, Prediction } from './Prediction';
import AbstractService from '../common/AbstractService';
import { IPredictionDao } from './PredictionDao';
import { ICommonDao } from '../common/ICommonDao';
import { IService } from '../common/IService';
import { ICompetitionListeners, MatchTeamType } from '../../types/base';
import { FinalPartPredictionStages, LeagueCodes } from '../../const';
import { IMatch } from '../matches/Match';
import { ICompetition } from '../competitions/Competition';
import { IMatchService } from '../matches/MatchService';
import { MatchStatus } from '../types/Base';

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

  private readonly matchService: IMatchService;

  constructor(dao: IPredictionDao, matchService: IMatchService) {
    super();
    this.dao = dao;
    this.matchService = matchService;
  }

  getDao(): ICommonDao<IPrediction> {
    return this.dao;
  }

  async getPredictionsByUser(userViberId: string): Promise<Record<string, IPrediction>> {
    const result = await this.dao.predictionsByUser(userViberId);
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

    const existPrediction = await this.dao.userMatchPrediction(userViberId, match._id);

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
    return this.dao.predictionsByMatchesIds(userViberId, matchesIds);
  }

  async update(competitionWithMatches: ICompetition): Promise<void> {
    if (!competitionWithMatches || !competitionWithMatches.matches) return;

    // 0) достаем прогнозы с userPredictScore = null
    const predictions = await this.dao.emptyUsersPredictionsScore();
    const predictMatchesIds = Object.keys(predictions).map((matchId) => new ObjectId(matchId));
    // 1) достаем матчи из 0), чтобы получить viberId,
    // т.к. в матчах из api нет id из нашей базы, которые в predictMatchesIds,
    // поэтому будем сравнивать матчи по viberId
    const predictMatches = await this.matchService.getMatchesByIds(predictMatchesIds);
    const matchesViberIdMap: Record<number, IMatch> = predictMatches.reduce((acc, match) => {
      if (!acc[match.id]) {
        return {
          ...acc,
          [match.id]: match,
        };
      }
      return { ...acc };
    }, {} as Record<number, IMatch>);
    // 2) фильтруем матчи из competitionWithMatches по статусу MatchStatus.FINISHED и по viberId из predictions
    const competitionFinishedMatchesByPrediction: Record<
      number,
      IMatch
    > = competitionWithMatches.matches.reduce((acc, match) => {
      if (matchesViberIdMap[match.id] && match.status === MatchStatus.FINISHED) {
        return {
          ...acc,
          [match.id]: match,
        };
      }
      return { ...acc };
    }, {});
    // 3) сравниваем матч из 1) с матчем из 2) по статусу
    // если статус у 1) отличается от 2), берем счет матча
    predictMatches.forEach((match) => {
      const isFinalPartOfCompetition = this.matchService.isFinalPart(
        competitionWithMatches.code as LeagueCodes,
        match.stage,
      );
      let userPredictScore = 0;
      // если финальная часть турнира, то считаем по сложному
      if (isFinalPartOfCompetition) {
        const updatedMatch = competitionFinishedMatchesByPrediction[match.id];
        const updatedMatchScore = updatedMatch.score;
        // считаем счет основного времени для homeTeam и awayTeam
        const matchRegularTime = {
          homeTeam:
            Number(updatedMatchScore.fullTime.homeTeam) -
            (Number(updatedMatchScore.extraTime.homeTeam) +
              Number(updatedMatchScore.penalties.homeTeam)),
          awayTeam:
            Number(updatedMatchScore.fullTime.awayTeam) -
            (Number(updatedMatchScore.extraTime.awayTeam) +
              Number(updatedMatchScore.penalties.awayTeam)),
        };
        const matchPredictScore = predictions[match._id.toHexString()].score;
        if (
          Number(matchPredictScore.regularTime.homeTeam) === matchRegularTime.homeTeam &&
          Number(matchPredictScore.regularTime.awayTeam) === matchRegularTime.awayTeam
        ) {
          userPredictScore += 6;
        } else {
          const isDrawRegularTime = matchRegularTime.homeTeam === matchRegularTime.awayTeam;
          const whoWonRegularTime =
            !isDrawRegularTime && matchRegularTime.homeTeam > matchRegularTime.awayTeam
              ? 'homeTeam'
              : 'awayTeam';
          const isPredictDrawRegularTime =
            matchPredictScore.regularTime.homeTeam === matchPredictScore.regularTime.awayTeam;
          const predictWhoWonRegularTime =
            !isPredictDrawRegularTime &&
            Number(matchPredictScore.regularTime.homeTeam) >
              Number(matchPredictScore.regularTime.awayTeam)
              ? 'homeTeam'
              : 'awayTeam';
          if (
            (isDrawRegularTime && isPredictDrawRegularTime) ||
            whoWonRegularTime === predictWhoWonRegularTime
          ) {
            userPredictScore += 2;
          }
        }
      } else {
        // иначе по простому
      }
    });
  }
}
