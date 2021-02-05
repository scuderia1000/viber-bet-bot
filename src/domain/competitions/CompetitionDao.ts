import { Db } from 'mongodb';
import { Competition, ICompetition } from './Competition';
import CRUDDao from '../common/CRUDDao';
import { ICommonDao } from '../common/ICommonDao';

export interface ICompetitionDao extends ICommonDao<ICompetition> {
  getCompetitionByCode(code: string): Promise<ICompetition | null>;
}

export class CompetitionDao extends CRUDDao<ICompetition> implements ICompetitionDao {
  constructor(db: Db) {
    super(db, Competition);
  }

  async getCompetitionByCode(code: string): Promise<ICompetition | null> {
    const results = await this.collection.findOne({ code });
    return this.toEntity(results);
  }
}
