import { Db, ObjectId } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IMatch, Match } from './Match';
import CRUDDao from '../common/CRUDDao';
import { MatchStatus } from '../types/Base';

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
      sort: { utcDate: -1 },
    };
    const cursor = this.collection.find({ 'season._id': seasonId, status }, options);
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
