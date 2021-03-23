import { Message } from 'viber-bot';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  country?: string;
  language?: string;
}

export interface ViberResponse {
  userProfile: UserProfile;
  send(messages: Message | Message[]): Promise<JSON>;
}

// interface Dictionary<T> {
//   [key: string]: T;
// }

export interface NgrokTunnel {
  proto: string;
  // eslint-disable-next-line camelcase
  pulic_url: string;
}

export interface NgrokConfig {
  tunnels: NgrokTunnel[];
}

export interface ICompetitionListeners {
  update(data: any): Promise<void>;
}

export enum EventType {
  GET_COMPETITION = 'get_competition',
  GET_SEASON = 'get_season',
  GET_MATCHES = 'get_matches',
  GET_TEAMS = 'get_teams',
}

export interface IScheduler {
  run(): void;
}

export enum ButtonSize {
  XS = 1,
  S = 2,
  M = 3,
  L = 4,
  XL = 5,
  XXL = 6,
}

export enum ActionType {
  REPLY = 'reply',
  OPEN_URL = 'open-url',
  LOCATION_PICKER = 'location-picker',
  SHARE_PHONE = 'share-phone',
  NONE = 'none',
}

export enum TextHAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export enum TextVAlign {
  TOP = 'top',
  CENTER = 'center',
  BOTTOM = 'bottom',
}

export enum TextSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum BgMediaScaleType {
  CROP = 'crop',
  FILL = 'fill',
  FIT = 'fit',
}

export interface IButton {
  ActionBody: string;
  ActionType?: ActionType;
  Columns?: number;
  Rows?: number;
  BgColor?: string;
  BgMediaType?: string;
  BgMedia?: string;
  Text?: string;
  TextSize?: TextSize;
  TextHAlign?: TextHAlign;
  TextVAlign?: TextVAlign;
  Image?: string;
  TextOpacity?: number;
  BgMediaScaleType?: BgMediaScaleType;
  ImageScaleType?: BgMediaScaleType;
}

/**
 * Customize the keyboard input field
 */
export enum InputFieldState {
  REGULAR = 'regular', // default
  MINIMIZED = 'minimized',
  HIDDEN = 'hidden',
}

export enum KeyboardType {
  KEYBOARD = 'keyboard',
}

export interface IKeyboard {
  Type: KeyboardType;
  InputFieldState?: InputFieldState;
  Buttons: IButton[];
}

export interface IRichMedia {
  ButtonsGroupColumns: number;
  ButtonsGroupRows: number;
  BgColor: string;
  Buttons?: IButton[];
}

export enum MatchTeamType {
  HOME_TEAM = 'homeTeam',
  AWAY_TEAM = 'awayTeam',
}
