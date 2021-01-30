import { Db } from 'mongodb';
import { IModule } from '../types/Base';
import { IRoleService, RoleService } from './RoleService';
import { IRoleDao, RoleDao } from './RoleDao';

export type IRoleModule = IModule<IRoleService, IRoleDao>;

const getRoleModule = (db: Db): IRoleModule => {
  const dao = new RoleDao(db);
  const service = new RoleService(dao);

  return {
    service,
    dao,
  };
};

export default getRoleModule;
