import { Db, ObjectId } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IMatch, Match } from './Match';
import CRUDDao from '../common/CRUDDao';
import { MatchStatus } from '../types/Base';
import { ITeamShort, TeamShort } from '../teams/TeamShort';

export interface IMatchDao extends ICommonDao<IMatch> {
  getMatchesBySeasonId(seasonId?: number): Promise<Record<number, IMatch>>;
  getSeasonMatchesByStatus(seasonId: ObjectId, status: MatchStatus): Promise<IMatch[]>;
  getMatchTeamByType(matchId: ObjectId, matchTeamType: string): Promise<ITeamShort | null>;
  getMatchesBySeasonAndStage(seasonMongoId: ObjectId, stage: string): Promise<IMatch[]>;
}

export class MatchDao extends CRUDDao<IMatch> implements IMatchDao {
  constructor(db: Db) {
    super(db, Match);
  }

  async getMatchesBySeasonId(seasonId?: number): Promise<Record<number, IMatch>> {
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

  async getSeasonMatchesByStatus(seasonId: ObjectId, status: MatchStatus): Promise<IMatch[]> {
    const options = {
      $sort: { utcDate: 1 },
    };
    const cursor = this.collection.aggregate([
      {
        $match: {
          'season._id': seasonId,
          status,
        },
      },
      options,
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
    ]);

    const matches = await this.toEntityArray(cursor);
    return matches;
  }

  async getMatchTeamByType(matchId: ObjectId, matchTeamType: string): Promise<ITeamShort | null> {
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

  async getMatchesBySeasonAndStage(seasonMongoId: ObjectId, stage: string): Promise<IMatch[]> {
    const query = { 'season._id': seasonMongoId, stage };
    const cursor = this.collection.find(query);
    const matches = await this.toEntityArray(cursor);
    return matches;
  }
}
