export const createMessage = (userName: string, botName?: string) => {
  return {
    hi: () =>
      `Привет ${userName}. Я ${botName}! Я пока не готов общаться, но очень скоро у нас с тобой все получиться.`,
  };
};
