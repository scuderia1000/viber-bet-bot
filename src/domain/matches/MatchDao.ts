import { Db, ObjectId } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IMatch, Match } from './Match';
import CRUDDao from '../common/CRUDDao';
import { MatchStatus } from '../types/Base';
import { ITeamShort, TeamShort } from '../teams/TeamShort';
import { ChampionsLeagueStages, MAX_MATCH_COUNT_PER_PAGE, Stages } from '../../const';
import logger from '../../util/logger';

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
  seasonMatchesByStatusAndCurrentMatchdayCount(
    seasonId: ObjectId,
    status: MatchStatus[],
    currentMatchday: number,
  ): Promise<number>;
  seasonMatchesByStatusAndCurrentMatchdayPaged(
    seasonId: ObjectId,
    status: MatchStatus[],
    pageNumber: number,
    currentMatchday: number,
  ): Promise<IMatch[]>;
}

const getScheduledMatchesAggregateQuery = (
  seasonId: ObjectId,
  status: MatchStatus[] | MatchStatus,
  matchday?: number,
) => [
  {
    $match: {
      'season._id': seasonId,
      status: status instanceof Array ? { $in: status } : status,
      ...(matchday && { matchday }),
    },
  },
  {
    $sort: { utcDate: 1, group: 1 },
  },
  {
    $lookup: {
      from: 'teams',
      let: { team_id: '$homeTeam.id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$id', '$$team_id'] } } },
        { $project: { _id: 1, id: 1, name: 1, crestImageUrl: 1 } },
      ],
      as: 'homeTeam',
    },
  },
  {
    $unwind: '$homeTeam',
  },
  {
    $lookup: {
      from: 'teams',
      let: { team_id: '$awayTeam.id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$id', '$$team_id'] } } },
        { $project: { _id: 1, id: 1, name: 1, crestImageUrl: 1 } },
      ],
      as: 'awayTeam',
    },
  },
  {
    $unwind: '$awayTeam',
  },
];

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

  async seasonMatchesByStatusAndCurrentMatchdayCount(
    seasonId: ObjectId,
    status: MatchStatus[],
    matchday: number,
  ): Promise<number> {
    const query = { 'season._id': seasonId, status: { $in: status }, matchday };
    const count = await this.collection.countDocuments(query);
    return count;
  }

  async seasonMatchesByStatusAndCurrentMatchdayPaged(
    seasonId: ObjectId,
    status: MatchStatus[],
    pageNumber: number,
    matchday: number,
  ): Promise<IMatch[]> {
    const query = [
      ...getScheduledMatchesAggregateQuery(seasonId, status, matchday),
      { $skip: pageNumber * MAX_MATCH_COUNT_PER_PAGE },
      { $limit: MAX_MATCH_COUNT_PER_PAGE },
    ];
    const cursor = this.collection.aggregate(query);
    const matches = await this.toEntityArray(cursor);
    return matches;
  }
}
