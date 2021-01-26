import { CompetitionsScheduler } from './schedulers/CompetitionsScheduler';
import { IModules } from './domain';
import { EventManager } from './schedulers/event-manager';
import { EventType } from './types/base';

const configSchedulers = (modules: IModules): void => {
  const eventManager = new EventManager();
  const { competitionService } = modules.competitionModule;
  const { seasonService } = modules.seasonsModule;
  const competitionScheduler = new CompetitionsScheduler(eventManager);
  competitionScheduler.events.subscribe(EventType.GET_COMPETITION, competitionService);
  competitionScheduler.events.subscribe(EventType.GET_SEASON, seasonService);

  competitionScheduler.start();
};

export default configSchedulers;
