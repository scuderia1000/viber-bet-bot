import { ICompetition } from './Competition';
import { IError } from '../Base';
import { ICompetitionDao } from './CompetitionDao';

export interface ICompetitionService {
  getScheduledMatches(competitionId: number): Promise<ICompetition | IError>;
}

export class CompetitionService implements ICompetitionService {
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
}
