import { EventManager } from './event-manager';
import { IScheduler } from '../types/base';

export class CompetitionsScheduler implements IScheduler {
  public events: EventManager;

  constructor(events: EventManager) {
    this.events = events;
  }

  start(): void {
  }
}
