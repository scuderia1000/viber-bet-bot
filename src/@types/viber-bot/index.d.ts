// eslint-disable-next-line max-classes-per-file
declare module 'viber-bot' {
  interface UserProfile {
    id: string;
    name: string;
    avatar: string;
    country?: string;
    language?: string;
  }

  export interface Message {
    timestamp: string;
    token: string;
    trackingData: JSON;
    text?: string;
  }

  export interface ViberResponse {
    userProfile: UserProfile;
    send: (messages: Message | Message[]) => Promise<JSON>;
  }

  interface BotConfiguration {
    authToken: string;
    name: string;
    avatar: string;
    registerToEvents?: string[];
  }

  type SubscribeResponseHandlerCallback = (response: ViberResponse) => void;

  type RequestListener = (req: any, res: any) => void;

  export enum Events {
    MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
    MESSAGE_SENT = 'message_sent',
    SUBSCRIBED = 'subscribed',
    UNSUBSCRIBED = 'unsubscribed',
    CONVERSATION_STARTED = 'conversation_started',
    ERROR = 'error',
    FAILED = 'failed',
  }

  interface ConversationStartedOnFinishCallback {
    (responseMessage: Message, optionalTrackingData?: JSON): void;
  }

  interface OnConversationStartedCallback {
    (
      userProfile: UserProfile,
      isSubscribed: boolean,
      context: string,
      onFinish: ConversationStartedOnFinishCallback,
    ): void;
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

  export class Bot {
    constructor(loggerOrConfiguration: any, configuration: BotConfiguration);

    name: string;

    middleware: () => RequestListener;

    setWebhook: (url: string | undefined) => void;

    onSubscribe: (handler: SubscribeResponseHandlerCallback) => void;

    on: (event: Events, handler: (message: Message, response: ViberResponse) => void) => void;

    onConversationStarted: (callback: OnConversationStartedCallback) => void;

    onTextMessage: (
      regex: RegExp,
      handler: (message: Message, response: ViberResponse) => void,
    ) => void;
  }

  // eslint-disable-next-line import/export
  export class Message {
    constructor(timestamp: string, token: string, trackingData: JSON);
  }

  // eslint-disable-next-line import/export
  export namespace Message {
    export class Text extends Message {
      text: string;

      optionalKeyboard?: any;

      constructor(
        text: string,
        optionalKeyboard?: IKeyboard,
        optionalTrackingData?: JSON,
        timestamp?: string,
        token?: string,
        minApiVersion?: number,
      );
    }

    export class RichMedia extends Message {
      richMedia: IRichMedia;

      constructor(
        richMedia: IRichMedia,
        optionalKeyboard?: IKeyboard,
        optionalTrackingData?: JSON,
        timestamp?: string,
        token?: string,
        optionalAltText?: string,
        minApiVersion?: number,
      );
    }

    export class Keyboard extends Message {
      text: string;

      constructor(text: string);
    }
  }
}
