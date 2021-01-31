import { CompetitionsScheduler } from './schedulers/CompetitionsScheduler';
import { IModules } from './domain';
import { EventManager } from './schedulers/event-manager';
import { EventType } from './types/base';
import { API } from './const';

// код лиги чемпионов
const championsLeague = API.FOOTBALL_DATA_ORG.LEAGUE_CODE.CHAMPIONS;

const configSchedulers = (modules: IModules): void => {
  const eventManager = new EventManager();
  const { service: competitionService } = modules.competitionModule;
  const { service: seasonService } = modules.seasonsModule;
  const competitionScheduler = new CompetitionsScheduler(eventManager, championsLeague);
  competitionScheduler.events.subscribe(EventType.GET_COMPETITION, competitionService);
  competitionScheduler.events.subscribe(EventType.GET_SEASON, seasonService);

  competitionScheduler.run();
};

export default configSchedulers;
