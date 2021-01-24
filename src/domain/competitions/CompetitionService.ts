import { ICompetition } from './Competition';
import { IError } from '../types/Base';
import { ICompetitionDao } from './CompetitionDao';
import { ICompetitionListeners } from '../../types/base';
import AbstractService from '../common/AbstractService';
import { ICommonDao } from '../common/ICommonDao';

export interface ICompetitionService {
  getScheduledMatches(competitionId: number): Promise<ICompetition | IError>;
}

export class CompetitionService
  extends AbstractService<ICompetition>
  implements ICompetitionService, ICompetitionListeners {
  private readonly dao: ICompetitionDao;

  constructor(competitionDao: ICompetitionDao) {
    super();
    this.dao = competitionDao;
  }

  async getScheduledMatches(competitionId: number): Promise<ICompetition | IError> {
    const competition = await this.dao.getCompetitionWithScheduledMatches(competitionId);
    if (!competition) {
      return new Error(`Соревнование с id: ${competitionId} не найдено`);
    }
    return competition;
  }

  async update(competition: ICompetition): Promise<void> {
    const existCompetition = await this.get(competition._id);
    if (!existCompetition) {
      await this.save(competition);
    } else if (!competition.equals(existCompetition)) {
      await this.updateEntity(competition);
    }
  }

  getDao(): ICommonDao<ICompetition> {
    return this.dao;
  }
}
