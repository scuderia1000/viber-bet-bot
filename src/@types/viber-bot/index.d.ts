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
  }

  export class Bot {
    constructor(loggerOrConfiguration: any, configuration: BotConfiguration);

    name: string;

    middleware: () => RequestListener;

    setWebhook: (url: string | undefined) => void;

    onSubscribe: (handler: SubscribeResponseHandlerCallback) => void;

    on: (event: Events, handler: (message: Message, response: ViberResponse) => void) => void;
  }

  // eslint-disable-next-line import/export
  export class Message {
    constructor(timestamp: string, token: string, trackingData: JSON);
  }

  // eslint-disable-next-line import/export
  export namespace Message {
    export class Text extends Message {
      constructor(text: string);
    }
  }
}