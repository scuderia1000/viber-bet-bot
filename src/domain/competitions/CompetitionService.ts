import { ObjectId } from 'mongodb';
import { ICompetition } from './Competition';
import { ICompetitionDao } from './CompetitionDao';
import { ICompetitionListeners } from '../../types/base';
import AbstractService from '../common/AbstractService';
import { ICommonDao } from '../common/ICommonDao';
import { IService } from '../common/IService';
import { API } from '../../const';

export interface ICompetitionService extends IService<ICompetition> {
  getCompetitionByCode(code?: string): Promise<ICompetition | null>;
}

export class CompetitionService
  extends AbstractService<ICompetition>
  implements ICompetitionService, ICompetitionListeners {
  private readonly dao: ICompetitionDao;

  constructor(competitionDao: ICompetitionDao) {
    super();
    this.dao = competitionDao;
  }

  async update(competition: ICompetition): Promise<void> {
    if (!competition.id) return;

    const existCompetition = await this.getById(competition.id);
    if (!existCompetition) {
      await this.save(competition);
    } else if (!competition.equals(existCompetition)) {
      // заменяем существующую запись, т.к. меняется только сезон, а соревнование остается старым
      // eslint-disable-next-line no-param-reassign
      competition._id = existCompetition._id;
      if (competition.season) {
        // eslint-disable-next-line no-param-reassign
        competition.season._id = new ObjectId('');
      }
      await this.updateEntity(competition);
    }
  }

  getDao(): ICommonDao<ICompetition> {
    return this.dao;
  }

  getCompetitionByCode(
    code = API.FOOTBALL_DATA_ORG.LEAGUE_CODE.CHAMPIONS,
  ): Promise<ICompetition | null> {
    return this.dao.getCompetitionByCode(code);
  }
}
