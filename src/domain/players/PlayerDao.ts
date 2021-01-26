import { ICommonDao } from '../common/ICommonDao';
import { IPlayer, Player } from './Player';
import CRUDDao from '../common/CRUDDao';
import { Db } from 'mongodb';

export type IPlayerDao = ICommonDao<IPlayer>;

export class PlayerDao extends CRUDDao<IPlayer> implements IPlayerDao {
  constructor(db: Db) {
    super(db, Player);
  }
}
