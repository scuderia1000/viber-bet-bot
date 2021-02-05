import { Db } from 'mongodb';
import { IModule } from '../types/Base';
import { TeamService } from './TeamService';
import { ITeamDao, TeamDao } from './TeamDao';

export type ITeamModule = IModule<TeamService, ITeamDao>;

const getTeamModule = (db: Db): ITeamModule => {
  const dao = new TeamDao(db);
  const service = new TeamService(dao);

  return {
    service,
    dao,
  };
};

export default getTeamModule;
