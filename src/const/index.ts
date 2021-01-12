export const conversationStartedText = (userName: string): string =>
  `Привет ${userName}! Я чат-бот Вася! Я принимаю ставки на Лигу Чемпионов 2020 - 2021, делайте ваши ставки господа!`;

export const DB = {
  DEFAULT_NAME: 'viber-bet-bot',
  SUCCESS_CONNECTION: 'Connected successfully to DB server',
  ERROR_CONNECTION: 'Fail connect to DB server',
};

export enum ROLES {
  ADMIN = 'admin',
  USER = 'user',
}
