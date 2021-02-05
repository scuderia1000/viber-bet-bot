import { ICompetition } from './Competition';
import { IError } from '../types/Base';
import { ICompetitionDao } from './CompetitionDao';
import { ICompetitionListeners } from '../../types/base';
import AbstractService from '../common/AbstractService';
import { ICommonDao } from '../common/ICommonDao';
import { IService } from '../common/IService';

export interface ICompetitionService extends IService<ICompetition> {
  getCompetitionByCode(code: string): Promise<ICompetition | null>;
}

export class CompetitionService
  extends AbstractService<ICompetition>
  implements ICompetitionService, ICompetitionListeners {
  private readonly dao: ICompetitionDao;

  constructor(competitionDao: ICompetitionDao) {
    super();
    this.dao = competitionDao;
  }

  // async getScheduledMatches(competitionId: number): Promise<ICompetition | IError> {
  //   const competition = await this.dao.getCompetitionWithScheduledMatches(competitionId);
  //   if (!competition) {
  //     return new Error(`Соревнование с id: ${competitionId} не найдено`);
  //   }
  //   return competition;
  // }

  async update(competition: ICompetition): Promise<void> {
    if (!competition.id) return;

    const existCompetition = await this.getById(competition.id);
    if (!existCompetition) {
      await this.save(competition);
    } else if (!competition.equals(existCompetition)) {
      await this.updateEntity(competition);
    }
  }

  getDao(): ICommonDao<ICompetition> {
    return this.dao;
  }

  getCompetitionByCode(code: string): Promise<ICompetition | null> {
    return this.dao.getCompetitionByCode(code);
  }
}
