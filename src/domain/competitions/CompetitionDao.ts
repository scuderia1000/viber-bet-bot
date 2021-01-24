import { ICompetition } from './Competition';
import CRUDDao from '../common/CRUDDao';
import { ICommonDao } from '../common/ICommonDao';

export interface ICompetitionDao extends ICommonDao<ICompetition> {
  getCompetitionWithScheduledMatches(competitionId: number): Promise<ICompetition | null>;
}

export class CompetitionDao extends CRUDDao<ICompetition> implements ICompetitionDao {
  // TODO добавить статус
  async getCompetitionWithScheduledMatches(competitionId: number): Promise<ICompetition | null> {
    const results = await this.collection.findOne({ _id: competitionId });
    return results;
  }
}
