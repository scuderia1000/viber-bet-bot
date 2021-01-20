import { EventType, ICompetitionListeners } from '../../types/base';
import logger from '../../util/logger';

export interface IEventManager {
  subscribe(eventType: EventType, listener: ICompetitionListeners): void;
  unsubscribe(eventType: EventType, listener: ICompetitionListeners): void;
  notify(eventType: EventType, data: any): void;
}

export class EventManager implements IEventManager {
  // Пока на 1 тип события может быть только 1 слушатель
  private listeners: Map<EventType, ICompetitionListeners> = new Map();

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  public notify(eventType: EventType, data: any): void {
    logger.debug('Notifying listener of event: %s to update data', eventType);
    // eslint-disable-next-line no-unused-expressions
    this.listeners.get(eventType)?.update(data);
  }

  public subscribe(eventType: EventType, listener: ICompetitionListeners): void {
    this.listeners.set(eventType, listener);
  }

  public unsubscribe(eventType: EventType): void {
    this.listeners.delete(eventType);
  }
}
