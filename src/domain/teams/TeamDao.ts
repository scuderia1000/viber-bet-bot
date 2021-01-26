import { Db } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { ITeam, Team } from './Team';
import CRUDDao from '../common/CRUDDao';

export type ITeamDao = ICommonDao<ITeam>;

export class TeamDao extends CRUDDao<ITeam> implements ITeamDao {
  constructor(db: Db) {
    super(db, Team);
  }
}
