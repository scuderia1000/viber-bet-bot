import { ICompetition } from './Competition';
import { IError } from '../Base';
import { ICompetitionDao } from './CompetitionDao';
import changeIdProperty from '../../util/changeIdProperty';
import logger from '../../util/logger';

export interface ICompetitionService {
  getScheduledMatches(competitionId: number): Promise<ICompetition | IError>;
  save(competition: ICompetition): Promise<void>;
  get(id: number): Promise<ICompetition | null>;
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

  get(id: number): Promise<ICompetition | null> {
    return this.competitionDao.get(id);
  }

  async save(competition: ICompetition): Promise<void> {
    // eslint-disable-next-line no-prototype-builtins
    if (competition && competition.hasOwnProperty('id')) {
      changeIdProperty(competition);
    }
    logger.debug('changed id season: %s', competition);
    const existCompetition = await this.get(competition._id);
    if (!existCompetition || JSON.stringify(existCompetition) !== JSON.stringify(competition)) {
      await this.competitionDao.save(competition);
    }
  }
}
