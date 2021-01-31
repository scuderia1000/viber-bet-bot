import { Db } from 'mongodb';
import { IModule } from '../types/Base';
import { MatchService } from './MatchService';
import { IMatchDao, MatchDao } from './MatchDao';

export type IMatchModule = IModule<MatchService, IMatchDao>;

const getMatchModule = (db: Db): IMatchModule => {
  const dao = new MatchDao(db);
  const service = new MatchService(dao);

  return {
    service,
    dao,
  };
};

export default getMatchModule;
