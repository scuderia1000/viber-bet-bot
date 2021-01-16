import getCompetition from '../../api/football-data-org';
import { EventType, ICompetitionListeners } from '../../types/base';
import logger from '../../util/logger';

export interface IEventManager {
  subscribe(eventType: EventType, listener: ICompetitionListeners): void;
  unsubscribe(eventType: EventType, listener: ICompetitionListeners): void;
  notify(eventType: EventType, data: any): void;
}

export class EventManager implements IEventManager {
  private listeners: Map<EventType, ICompetitionListeners> = new Map();

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  public notify(eventType: EventType, data: any): void {
    logger.debug('Notifying listener of event: %s to update data', eventType);
    // eslint-disable-next-line no-unused-expressions
    this.listeners.get(eventType)?.update(data);
  }

  public subscribe(eventType: EventType, listener: ICompetitionListeners): void {
  }

  public unsubscribe(eventType: EventType, listener: ICompetitionListeners): void {
  }

}

// const observeCompetition = (requestInterval: number = defaultInterval): void => {
//   setInterval(() => {
//     getCompetition();
//   }, requestInterval);
// };
//
// export default observeCompetition;
