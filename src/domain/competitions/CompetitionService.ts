import { ICompetition } from './Competition';
import { IError } from '../types/Base';
import { ICompetitionDao } from './CompetitionDao';
import changeIdProperty from '../../util/changeIdProperty';
import { ICompetitionListeners } from '../../types/base';

export interface ICompetitionService {
  getScheduledMatches(competitionId: number): Promise<ICompetition | IError>;
  save(competition: ICompetition): Promise<void>;
  get(id: number): Promise<ICompetition | null>;
  updateCompetition(competition: ICompetition): Promise<void>;
}

export class CompetitionService implements ICompetitionService, ICompetitionListeners {
  private competitionDao: ICompetitionDao;

  constructor(competitionDao: ICompetitionDao) {
    this.competitionDao = competitionDao;
  }

  async getScheduledMatches(competitionId: number): Promise<ICompetition | IError> {
    const competition = await this.competitionDao.getCompetitionWithScheduledMatches(competitionId);
    if (!competition) {
      return new Error(`Соревнование с id: ${competitionId} не найдено`);
    }
    return competition;
  }

  get(id: number): Promise<ICompetition | null> {
    return this.competitionDao.get(id);
  }

  save(competition: ICompetition): Promise<void> {
    return this.competitionDao.save(competition);
  }

  updateCompetition(competition: ICompetition): Promise<void> {
    return this.competitionDao.update(competition);
  }

  async update(competition: ICompetition): Promise<void> {
    const existCompetition = await this.get(competition._id);
    if (!existCompetition) {
      await this.save(competition);
    } else if (!competition.equals(existCompetition)) {
      await this.updateCompetition(competition);
    }
  }
}
