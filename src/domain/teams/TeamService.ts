import { IService } from '../common/IService';
import { ITeam } from './Team';
import AbstractService from '../common/AbstractService';
import { ITeamDao } from './TeamDao';
import { ICommonDao } from '../common/ICommonDao';
import { ICompetitionListeners } from '../../types/base';

export type ITeamService = IService<ITeam>;

export class TeamService
  extends AbstractService<ITeam>
  implements ITeamService, ICompetitionListeners {
  private readonly dao: ITeamDao;

  constructor(dao: ITeamDao) {
    super();
    this.dao = dao;
  }

  getDao(): ICommonDao<ITeam> {
    return this.dao;
  }

  update(data: any): Promise<void> {
    return Promise.resolve(undefined);
  }
}
