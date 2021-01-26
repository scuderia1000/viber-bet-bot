import { Db } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { IMatch, Match } from './Match';
import CRUDDao from '../common/CRUDDao';

export type IMatchDao = ICommonDao<IMatch>;

export class MatchDao extends CRUDDao<IMatch> implements IMatchDao {
  constructor(db: Db) {
    super(db, Match);
  }
}
