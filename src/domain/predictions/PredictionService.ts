import { ObjectId } from 'mongodb';
import { IPrediction, Prediction } from './Prediction';
import AbstractService from '../common/AbstractService';
import { IPredictionDao } from './PredictionDao';
import { ICommonDao } from '../common/ICommonDao';
import { IService } from '../common/IService';
import { ICompetitionListeners, MatchTeamType } from '../../types/base';
import { FinalPartPredictionStages, LeagueCodes, TeamType } from '../../const';
import { IMatch, IScore } from '../matches/Match';
import { IMatchService, IUsersPredictionsResults } from '../matches/MatchService';
import { MatchStatus } from '../types/Base';
import { ICompetitionWithMatches } from '../../api/football-data-org';

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
  allUsersResults(): Promise<IUsersPredictionsResults[]>;
}

interface MatchStageScore {
  [TeamType.HOME_TEAM]: number;
  [TeamType.AWAY_TEAM]: number;
}

interface IPredictMatchResult {
  regularTime: MatchStageScore;
  isDrawRegularTime: boolean;
  extraTime?: MatchStageScore;
  penalties?: MatchStageScore;
  isDrawExtraTime?: boolean;
  whoWonRegularTime?: TeamType;
  whoWonExtraTime?: TeamType;
  whoWonPenalties?: TeamType;
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

  async update(competitionWithMatches: ICompetitionWithMatches): Promise<void> {
    if (!competitionWithMatches || !competitionWithMatches.matches) return;

    // 0) достаем прогнозы с userPredictScore = null
    const predictions = await this.dao.emptyUsersPredictionsScore();
    // уникальные id матчей из прогнозов
    const predictMatchesIds = new Set<ObjectId>();
    predictions.forEach((prediction) => predictMatchesIds.add(prediction.matchId));
    // 1) достаем матчи из 0), чтобы получить viberId,
    // т.к. в матчах из api нет id из нашей базы, которые в predictMatchesIds,
    // поэтому будем сравнивать матчи по viberId
    const predictMatches = await this.matchService.getMatchesByIds(
      Array.from(predictMatchesIds.values()),
    );
    const predictMatchesViberIdMap: Record<number, IMatch> = predictMatches.reduce(
      (acc, match) => ({
        ...acc,
        [match.id]: match,
      }),
      {},
    );
    // 2) фильтруем матчи из competitionWithMatches по статусу MatchStatus.FINISHED и по viberId из predictions
    const competitionFinishedMatchesByPrediction: Record<
      number,
      IMatch
    > = competitionWithMatches.matches.reduce((acc, match) => {
      if (predictMatchesViberIdMap[match.id] && match.status === MatchStatus.FINISHED) {
        return {
          ...acc,
          [match.id]: match,
        };
      }
      return { ...acc };
    }, {});
    // считаем результаты прогнозов на матчи
    const predictMatchesMap: Record<string, IMatch> = predictMatches.reduce(
      (acc, match) => ({
        ...acc,
        [match._id.toHexString()]: match,
      }),
      {} as Record<number, IMatch>,
    );
    predictions.forEach((predict) => {
      const matchToPredict = predictMatchesMap[predict.matchId.toHexString()];
      const isFinalPartOfCompetition = this.matchService.isFinalPart(
        competitionWithMatches.competition.code as LeagueCodes,
        predict.matchStage,
      );
      const updatedMatch = competitionFinishedMatchesByPrediction[matchToPredict.id];
      if (updatedMatch) {
        // eslint-disable-next-line no-param-reassign
        predict.userPredictScore = this.getUserScore(
          updatedMatch.score,
          predict.score as IScore,
          isFinalPartOfCompetition,
        );
      }
    });
    if (predictions.length) {
      await this.dao.replaceMany(predictions);
    }
  }

  getUserScore(
    matchScore: IScore,
    predictScore: IScore,
    isFinalPartOfCompetition: boolean,
  ): number {
    let userPredictScore = 0;
    const matchResult = this.getMatchResults(matchScore);
    const predictMatchResult = this.getMatchResults(predictScore);
    // если финальная часть турнира, то считаем по сложному
    if (isFinalPartOfCompetition) {
      // считаем счет основного времени для homeTeam и awayTeam
      // Основное время
      if (
        predictMatchResult.regularTime.homeTeam === matchResult.regularTime.homeTeam &&
        predictMatchResult.regularTime.awayTeam === matchResult.regularTime.awayTeam
      ) {
        // угадан счет
        userPredictScore += 6;
      } else if (
        (predictMatchResult.isDrawRegularTime && matchResult.isDrawRegularTime) ||
        predictMatchResult.whoWonRegularTime === matchResult.whoWonRegularTime
      ) {
        // угадан исход
        userPredictScore += 2;
      }
      // Дополнительное время
      if (predictMatchResult.extraTime && matchResult.extraTime) {
        if (
          predictMatchResult.extraTime.homeTeam === matchResult.extraTime.homeTeam &&
          predictMatchResult.extraTime.awayTeam === matchResult.extraTime.awayTeam
        ) {
          // угадан счет
          userPredictScore += 3;
        } else if (
          (predictMatchResult.isDrawExtraTime && matchResult.isDrawExtraTime) ||
          predictMatchResult.whoWonExtraTime === matchResult.whoWonExtraTime
        ) {
          // угадан исход
          userPredictScore += 1;
        }
      }
      // Серия пенальти
      if (predictMatchResult.penalties && matchResult.penalties) {
        if (
          predictMatchResult.penalties.homeTeam === matchResult.penalties.homeTeam &&
          predictMatchResult.penalties.awayTeam === matchResult.penalties.awayTeam
        ) {
          // угадан счет
          userPredictScore += 3;
        } else if (predictMatchResult.whoWonPenalties === matchResult.whoWonPenalties) {
          // угадан исход
          userPredictScore += 1;
        }
      }
    }
    // иначе по простому
    // Основное время
    else if (
      predictMatchResult.regularTime.homeTeam === matchResult.regularTime.homeTeam &&
      predictMatchResult.regularTime.awayTeam === matchResult.regularTime.awayTeam
    ) {
      // угадан счет
      userPredictScore += 3;
    } else if (
      (predictMatchResult.isDrawRegularTime && matchResult.isDrawRegularTime) ||
      predictMatchResult.whoWonRegularTime === matchResult.whoWonRegularTime
    ) {
      // угадан исход
      userPredictScore += 1;
    }
    return userPredictScore;
  }

  // eslint-disable-next-line class-methods-use-this
  getMatchResults(score: IScore): IPredictMatchResult {
    const regularTimeScore = {
      homeTeam:
        Number(score.fullTime.homeTeam) -
        (Number(score.extraTime.homeTeam) + Number(score.penalties.homeTeam)),
      awayTeam:
        Number(score.fullTime.awayTeam) -
        (Number(score.extraTime.awayTeam) + Number(score.penalties.awayTeam)),
    };
    let extraTimeScore;
    let penaltiesScore;
    let whoWonRegularTime;
    let whoWonExtraTime;
    let whoWonPenalties;
    let isDrawRegularTime = false;
    let isDrawExtraTime;
    // Основное время
    if (regularTimeScore.homeTeam > regularTimeScore.awayTeam) {
      whoWonRegularTime = TeamType.HOME_TEAM;
    } else if (regularTimeScore.homeTeam < regularTimeScore.awayTeam) {
      whoWonRegularTime = TeamType.AWAY_TEAM;
    } else {
      isDrawRegularTime = true;
    }
    // Дополнительное время
    if (score.extraTime.homeTeam !== null) {
      extraTimeScore = {
        homeTeam: Number(score.extraTime.homeTeam),
        awayTeam: Number(score.extraTime.awayTeam),
      };
      if (Number(score.extraTime.homeTeam) > Number(score.extraTime.awayTeam)) {
        whoWonExtraTime = TeamType.HOME_TEAM;
      } else if (Number(score.extraTime.homeTeam) < Number(score.extraTime.awayTeam)) {
        whoWonExtraTime = TeamType.AWAY_TEAM;
      } else {
        isDrawExtraTime = true;
      }
    }
    // Серия пенальти
    if (score.penalties.homeTeam !== null) {
      penaltiesScore = {
        homeTeam: Number(score.penalties.homeTeam),
        awayTeam: Number(score.penalties.awayTeam),
      };
      if (Number(score.penalties.homeTeam) > Number(score.penalties.awayTeam)) {
        whoWonPenalties = TeamType.HOME_TEAM;
      } else if (Number(score.penalties.homeTeam) < Number(score.penalties.awayTeam)) {
        whoWonPenalties = TeamType.AWAY_TEAM;
      }
    }

    return {
      regularTime: regularTimeScore,
      extraTime: extraTimeScore,
      penalties: penaltiesScore,
      isDrawRegularTime,
      isDrawExtraTime,
      whoWonRegularTime,
      whoWonExtraTime,
      whoWonPenalties,
    };
  }

  async allUsersResults(): Promise<IUsersPredictionsResults[]> {
    const result: IUsersPredictionsResults[] = await this.dao.allUsersResults();
    return result;
  }
}
