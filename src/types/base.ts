import { Message } from 'viber-bot';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  country?: string;
  language?: string;
}

// export interface Message {
//   timestamp: string;
//   token: string;
//   trackingData: JSON;
// }

export interface ViberResponse {
  userProfile: UserProfile;
  send: (messages: Message | Message[]) => Promise<JSON>;
}

interface Dictionary<T> {
  [key: string]: T;
}

export interface NgrokTunnel {
  proto: string;
  // eslint-disable-next-line camelcase
  pulic_url: string;
}

export interface NgrokConfig {
  tunnels: NgrokTunnel[];
}

export enum KeyboardType {
  KEYBOARD = 'keyboard',
}

/**
 * Customize the keyboard input field
 */
export enum InputFieldState {
  REGULAR = 'regular', // default
  MINIMIZED = 'minimized',
  HIDDEN = 'hidden',
}

export interface IKeyboardButton {
  Columns: number;
  Rows: number;
  Text: string;
  TextSize: string;
  TextHAlign: string;
  TextVAlign: string;
  ActionType: string;
  ActionBody: string;
  BgColor: string;
}

export interface IKeyboard {
  Type: KeyboardType;
  InputFieldState?: InputFieldState;
  Buttons: IKeyboardButton[];
}

export interface ICompetitionListeners {
  update(data: any): Promise<void>;
}

export enum EventType {
  GET_COMPETITION = 'get_competition',
  GET_SEASON = 'get_season',
  GET_MATCHES = 'get_matches',
}

export interface IScheduler {
  start(): void;
}
