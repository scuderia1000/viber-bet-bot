import { Db } from 'mongodb';
import { ICompetition } from './Competition';
import logger from '../../util/logger';

const collectionName = 'competitions';

export interface ICompetitionDao {
  getCompetitionWithScheduledMatches(competitionId: number): Promise<ICompetition | null>;
  save(competition: ICompetition): Promise<void>;
  get(id: number): Promise<ICompetition | null>;
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

  async save(competition: ICompetition): Promise<void> {
    await this.db.collection<ICompetition>(collectionName).insertOne(competition);
    logger.debug('Successfully save competition: %s', competition);
  }

  async get(id: number): Promise<ICompetition | null> {
    const result = await this.db.collection<ICompetition>(collectionName).findOne({ _id: id });
    return result;
  }
}
