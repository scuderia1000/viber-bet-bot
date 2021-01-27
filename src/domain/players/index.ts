import { Db } from 'mongodb';
import { IModule } from '../types/Base';
import { IPlayerService, PlayerService } from './PlayerService';
import { IPlayerDao, PlayerDao } from './PlayerDao';

export type IPlayerModule = IModule<IPlayerService, IPlayerDao>;

const getPlayerModule = (db: Db): IPlayerModule => {
  const dao = new PlayerDao(db);
  const service = new PlayerService(dao);

  return {
    service,
    dao,
  };
};

export default getPlayerModule;
