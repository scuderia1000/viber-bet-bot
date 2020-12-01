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
