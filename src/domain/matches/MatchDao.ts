import { Db, ObjectId } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IMatch, Match } from './Match';
import CRUDDao from '../common/CRUDDao';
import { MatchStatus } from '../types/Base';
import { TeamShort } from '../teams/TeamShort';

export interface IMatchDao extends ICommonDao<IMatch> {
  getMatchesBySeasonId(seasonId?: number): Promise<Record<number, IMatch>>;
  getSeasonMatchesByStatus(seasonId: ObjectId, status: MatchStatus): Promise<IMatch[]>;
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
      $sort: { utcDate: -1 },
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

    const matches: IMatch[] = [];
    await cursor.forEach((document) => {
      const match = this.toEntity(document);
      if (match) {
        matches.push(match);
      }
    });
    return matches;
  }
}
