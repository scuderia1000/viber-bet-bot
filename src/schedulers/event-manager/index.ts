import getCompetition from '../../api/football-data-org';
import { EventType, ICompetitionListeners } from '../../types/base';

const defaultInterval = 60 * 60 * 1000; // 1 час

export interface IEventManager {
  subscribe(eventType: EventType, listener: ICompetitionListeners): void;
  unsubscribe(eventType: EventType, listener: ICompetitionListeners): void;
  notify(eventType: EventType, data: any): void;
}

export class EventManager implements IEventManager {
  private listeners: Map<EventType, ICompetitionListeners> = new Map();

  public notify(eventType: EventType, data: any): void {
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
