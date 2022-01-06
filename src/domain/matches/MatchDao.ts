import { Db, ObjectId } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IMatch, Match } from './Match';
import CRUDDao from '../common/CRUDDao';
import { MatchStatus } from '../types/Base';
import { ITeamShort, TeamShort } from '../teams/TeamShort';
import { ChampionsLeagueStages, MAX_MATCH_COUNT_PER_PAGE, Stages } from '../../const';
import { IUsersPredictionsResults } from './MatchService';
import {
  allUsersResults,
  getScheduledMatchesAggregateQuery,
  prevStageUsersResultQuery,
} from './queries';

export interface IMatchDao extends ICommonDao<Match> {
  matchesBySeasonId(seasonId?: number): Promise<Record<number, IMatch>>;
  seasonMatchesByStatus(seasonId: ObjectId, status: MatchStatus): Promise<IMatch[]>;
  matchTeamByType(matchId: ObjectId, matchTeamType: string): Promise<ITeamShort | null>;
  matchesBySeasonAndStage(
    seasonMongoId: ObjectId,
    stage: Stages,
    statuses?: MatchStatus[],
  ): Promise<IMatch[]>;
  seasonMatchesByStatusPaged(
    seasonId: ObjectId,
    status: MatchStatus,
    pageNumber: number,
  ): Promise<IMatch[]>;
  seasonMatchesByStatusCount(seasonId: ObjectId, status: MatchStatus): Promise<number>;
  matchesByStatusCount(
    seasonId: ObjectId,
    status: MatchStatus[],
    currentMatchday: number,
    stage: Stages,
  ): Promise<number>;
  matchesByStatusPaged(
    seasonId: ObjectId,
    status: MatchStatus[],
    currentMatchday: number,
    stage: Stages,
    pageNumber?: number,
  ): Promise<IMatch[]>;
  allUsersResultByStage(stage: Stages, matchday: number): Promise<IUsersPredictionsResults[]>;
}

export class MatchDao extends CRUDDao<IMatch> implements IMatchDao {
  constructor(db: Db) {
    super(db, Match);
  }

  async matchesBySeasonId(seasonId?: number): Promise<Record<number, IMatch>> {
    const cursor = this.collection.find({
      'season.id': seasonId,
    });
    const result: Record<number, IMatch> = {};
    await cursor.forEach((document) => {
      const match = this.toEntity(document);
      if (match && match.id) {
        result[match.id] = match;
      }
    });
    return result;
  }

  async seasonMatchesByStatus(seasonId: ObjectId, status: MatchStatus): Promise<IMatch[]> {
    const cursor = this.collection.aggregate(getScheduledMatchesAggregateQuery(seasonId, status));
    const matches = await this.toEntityArray(cursor);
    return matches;
  }

  async seasonMatchesByStatusPaged(
    seasonId: ObjectId,
    status: MatchStatus,
    pageNumber: number,
  ): Promise<IMatch[]> {
    const query = [...getScheduledMatchesAggregateQuery(seasonId, status)];
    this.addPageToQuery(query, pageNumber);

    const cursor = this.collection.aggregate(query);
    const matches = await this.toEntityArray(cursor);
    return matches;
  }

  async matchTeamByType(matchId: ObjectId, matchTeamType: string): Promise<ITeamShort | null> {
    const query = { _id: matchId };
    const options = {
      projection: { [matchTeamType]: 1 },
    };
    const matchResult = await this.collection.findOne(query, options);
    let team = null;
    if (matchResult) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      team = new TeamShort(matchResult[matchTeamType]);
    }
    return team;
  }

  async matchesBySeasonAndStage(
    seasonMongoId: ObjectId,
    stage: Stages,
    statuses?: MatchStatus[],
  ): Promise<IMatch[]> {
    const query = {
      'season._id': seasonMongoId,
      stage,
      ...(statuses?.length && { status: { $in: statuses } }),
    };
    const cursor = this.collection.find(query).sort('utcDate', -1);
    const matches = await this.toEntityArray(cursor);
    return matches;
  }

  async seasonMatchesByStatusCount(seasonId: ObjectId, status: MatchStatus): Promise<number> {
    const query = { 'season._id': seasonId, status };
    const count = await this.collection.countDocuments(query);
    return count;
  }

  async matchesByStatusCount(
    seasonId: ObjectId,
    status: MatchStatus[],
    matchday: number,
    stage: Stages,
  ): Promise<number> {
    const query = { 'season._id': seasonId, status: { $in: status }, stage, matchday };
    const count = await this.collection.countDocuments(query);
    return count;
  }

  async matchesByStatusPaged(
    seasonId: ObjectId,
    status: MatchStatus[],
    matchday: number,
    stage: ChampionsLeagueStages,
    pageNumber?: number,
  ): Promise<IMatch[]> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const query: object[] = [
      ...getScheduledMatchesAggregateQuery(seasonId, status, matchday, stage),
    ];
    this.addPageToQuery(query, pageNumber);

    const cursor = this.collection.aggregate(query);
    const matches = await this.toEntityArray(cursor);
    return matches;
  }

  async allUsersResultByStage(
    stage: Stages,
    matchday: number,
  ): Promise<IUsersPredictionsResults[]> {
    const query = [...prevStageUsersResultQuery(stage, matchday)];

    const cursor = this.collection.aggregate<IUsersPredictionsResults>(query);
    const result: IUsersPredictionsResults[] = await cursor.toArray();
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types,class-methods-use-this
  private addPageToQuery(query: object[], pageNumber?: number): void {
    if (pageNumber === undefined) {
      return;
    }
    query.push(
      ...[{ $skip: pageNumber * MAX_MATCH_COUNT_PER_PAGE }, { $limit: MAX_MATCH_COUNT_PER_PAGE }],
    );
  }
}
