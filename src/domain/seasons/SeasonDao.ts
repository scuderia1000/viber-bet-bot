import { Db } from 'mongodb';
import { ISeason, Season } from './Season';
import { ICommonDao } from '../common/ICommonDao';
import CRUDDao from '../common/CRUDDao';

export type ISeasonDao = ICommonDao<ISeason>;

export class SeasonDao extends CRUDDao<ISeason> implements ISeasonDao {
  constructor(db: Db) {
    super(db, Season);
  }
}
