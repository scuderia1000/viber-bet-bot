import { IService } from '../common/IService';
import { IArea } from './Area';
import AbstractService from '../common/AbstractService';
import { IAreaDao } from './AreaDao';
import { ICommonDao } from '../common/ICommonDao';

export type IAreaService = IService<IArea>;

export class AreaService extends AbstractService<IArea> implements IAreaService {
  private readonly dao: IAreaDao;

  constructor(dao: IAreaDao) {
    super();
    this.dao = dao;
  }

  getDao(): ICommonDao<IArea> {
    return this.dao;
  }
}
