import { Db } from 'mongodb';
import { IModule } from '../types/Base';
import { AreaService, IAreaService } from './AreaService';
import { AreaDao, IAreaDao } from './AreaDao';

export type IAreaModule = IModule<IAreaService, IAreaDao>;

const getAreaModule = (db: Db): IAreaModule => {
  const dao = new AreaDao(db);
  const service = new AreaService(dao);

  return {
    service,
    dao,
  };
};

export default getAreaModule;
