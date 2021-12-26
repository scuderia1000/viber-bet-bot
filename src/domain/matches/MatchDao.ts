import { Db, ObjectId } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IMatch, Match } from './Match';
import CRUDDao from '../common/CRUDDao';
import { MatchStatus } from '../types/Base';
import { ITeamShort, TeamShort } from '../teams/TeamShort';
import { ChampionsLeagueStages, MAX_MATCH_COUNT_PER_PAGE } from '../../const';
import { IUsersPrevStageResults } from './MatchService';
import { getScheduledMatchesAggregateQuery, prevStageUsersResultQuery } from './queries';

export interface IMatchDao extends ICommonDao<IMatch> {
  matchesBySeasonId(seasonId?: number): Promise<Record<number, IMatch>>;
  seasonMatchesByStatus(seasonId: ObjectId, status: MatchStatus): Promise<IMatch[]>;
  matchTeamByType(matchId: ObjectId, matchTeamType: string): Promise<ITeamShort | null>;
  matchesBySeasonAndStage(seasonMongoId: ObjectId, stage: ChampionsLeagueStages): Promise<IMatch[]>;
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
    stage: ChampionsLeagueStages,
  ): Promise<number>;
  matchesByStatusPaged(
    seasonId: ObjectId,
    status: MatchStatus[],
    currentMatchday: number,
    stage: ChampionsLeagueStages,
    pageNumber?: number,
  ): Promise<IMatch[]>;
  allUsersResultPrevStage(
    stage: ChampionsLeagueStages,
    matchday: number,
    pageNumber: number,
  ): Promise<IUsersPrevStageResults[]>;
  allUsersResults(pageNumber: number): Promise<IUsersPrevStageResults[]>;
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
    const query = [
      ...getScheduledMatchesAggregateQuery(seasonId, status),
      { $skip: pageNumber * MAX_MATCH_COUNT_PER_PAGE },
      { $limit: MAX_MATCH_COUNT_PER_PAGE },
    ];
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
    stage: ChampionsLeagueStages,
  ): Promise<IMatch[]> {
    const query = { 'season._id': seasonMongoId, stage };
    const cursor = this.collection.find(query);
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
    stage: ChampionsLeagueStages,
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
    if (pageNumber !== undefined) {
      query.push(
        ...[{ $skip: pageNumber * MAX_MATCH_COUNT_PER_PAGE }, { $limit: MAX_MATCH_COUNT_PER_PAGE }],
      );
    }
    const cursor = this.collection.aggregate(query);
    const matches = await this.toEntityArray(cursor);
    return matches;
  }

  async allUsersResultPrevStage(
    stage: ChampionsLeagueStages,
    matchday: number,
    pageNumber: number,
  ): Promise<IUsersPrevStageResults[]> {
    const query = [...prevStageUsersResultQuery(stage, matchday)];
    if (pageNumber !== undefined) {
      query.push(
        ...[{ $skip: pageNumber * MAX_MATCH_COUNT_PER_PAGE }, { $limit: MAX_MATCH_COUNT_PER_PAGE }],
      );
    }
    const cursor = this.collection.aggregate<IUsersPrevStageResults>(query);
    const result: IUsersPrevStageResults[] = await cursor.toArray();
    return result;
  }

  async allUsersResults(pageNumber: number): Promise<IUsersPrevStageResults[]> {
    return [];
  }
}
