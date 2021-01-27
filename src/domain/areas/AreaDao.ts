import { Db } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { Area, IArea } from './Area';
import CRUDDao from '../common/CRUDDao';

export type IAreaDao = ICommonDao<IArea>;

export class AreaDao extends CRUDDao<IArea> implements IAreaDao {
  constructor(db: Db) {
    super(db, Area);
  }
}
