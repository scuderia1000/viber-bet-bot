import { IService } from '../common/IService';
import { IMatch } from './Match';
import AbstractService from '../common/AbstractService';
import { ICompetitionListeners } from '../../types/base';
import { IMatchDao } from './MatchDao';
import { ICommonDao } from '../common/ICommonDao';

export type IMatchService = IService<IMatch>;

export class MatchService
  extends AbstractService<IMatch>
  implements IMatchService, ICompetitionListeners {
  private readonly dao: IMatchDao;

  constructor(dao: IMatchDao) {
    super();
    this.dao = dao;
  }

  getDao(): ICommonDao<IMatch> {
    return this.dao;
  }

  update(data: any): Promise<void> {
    return Promise.resolve(undefined);
  }
}
