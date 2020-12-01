import { Bot as ViberBot, Events as BotEvents, Message } from 'viber-bot';
import winston from 'winston';
import * as http from 'http';
import { ViberResponse } from './types/base';
import { createMessage } from './util';

const TextMessage = Message.Text;

function createLogger() {
  const logger = winston.createLogger({
    level: 'debug',
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    );
  }
  return logger;
}

const logger = createLogger();

const TOKEN = process.env.BOT_ACCOUNT_TOKEN ?? '4c8703e87b000b22-1a55ea83c8934515-b65d362d8e7dba28';
const URL = process.env.NOW_URL || process.env.HEROKU_URL;

const bot = new ViberBot(logger, {
  authToken: TOKEN,
  name: 'Phoenix Bet Bot', // <--- Your bot name here
  avatar: '', // It is recommended to be 720x720, and no more than 100kb.
});

if (URL) {
  const port = process.env.PORT || 8080;

  http
    .createServer(bot.middleware())
    .listen(port, () => bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL));
} else {
  logger.debug(
    'Could not find the now.sh/Heroku environment variables. Please make sure you followed readme guide.',
  );
}

const say = (response: ViberResponse, message: string): void => {
  response.send(new TextMessage(message));
};

bot.onSubscribe((response: ViberResponse) => {
  say(response, createMessage(response.userProfile.name, bot.name).hi());
});
