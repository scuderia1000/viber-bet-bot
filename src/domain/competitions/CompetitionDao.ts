import { Db } from 'mongodb';
import { ICompetition } from './Competition';

const collectionName = 'competitions';

export interface ICompetitionDao {
  getCompetitionWithScheduledMatches(competitionId: number): Promise<ICompetition | null>;
}

export class CompetitionDao implements ICompetitionDao {
  private db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async getCompetitionWithScheduledMatches(competitionId: number): Promise<ICompetition | null> {
    const results = await this.db
      .collection<ICompetition>(collectionName)
      .findOne({ _id: competitionId });
    return results;
  }
}
