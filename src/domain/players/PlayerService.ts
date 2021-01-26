import { IService } from '../common/IService';
import { IPlayer } from './Player';
import AbstractService from '../common/AbstractService';
import { ICompetitionListeners } from '../../types/base';
import { ICommonDao } from '../common/ICommonDao';
import { IPlayerDao } from './PlayerDao';

export type IPlayerService = IService<IPlayer>;

export class PlayerService
  extends AbstractService<IPlayer>
  implements IPlayerService, ICompetitionListeners {
  private readonly dao: IPlayerDao;

  constructor(dao: IPlayerDao) {
    super();
    this.dao = dao;
  }

  getDao(): ICommonDao<IPlayer> {
    return this.dao;
  }

  update(data: any): Promise<void> {
    return Promise.resolve(undefined);
  }
}
