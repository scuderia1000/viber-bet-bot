import { Db } from 'mongodb';
import { ICommonDao } from '../common/ICommonDao';
import { ITeam, Team } from './Team';
import CRUDDao from '../common/CRUDDao';
import { ITeamShort, TeamShort } from './TeamShort';

export interface ITeamDao extends ICommonDao<ITeam> {
  getAllTeamsShort(): Promise<ITeamShort[]>;
}

export class TeamDao extends CRUDDao<ITeam> implements ITeamDao {
  constructor(db: Db) {
    super(db, Team);
  }

  async getAllTeamsShort(): Promise<ITeamShort[]> {
    const query = { id: { $ne: undefined } };
    const options = {
      projection: { id: 1, name: 1, crestUrl: 1, crestImageUrl: 1 },
    };
    const cursor = await this.collection.find(query, options);

    const teamsShort: ITeamShort[] = [];
    await cursor.forEach((document) => {
      const team = new TeamShort(document);
      if (team) {
        teamsShort.push(team);
      }
    });
    return teamsShort;
  }
}
