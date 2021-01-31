import { Db } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IMatch, Match } from './Match';
import CRUDDao from '../common/CRUDDao';

export interface IMatchDao extends ICommonDao<IMatch> {
  getMatchesBySeasonId(seasonId?: number): Promise<Record<number, IMatch>>;
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
}
