import * as http from 'http';
import * as https from 'https';
import dotenv from 'dotenv';
import ngrok from './util/get-public-url';
import initializeBot from './bot';
import logger from './util/logger';
import connectDb from './domain/db';
import getModules from './domain';
import configSchedulers from './configSchedulers';

// Записываем переменные окружения из .env файла в process.env
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const TOKEN = process.env.BOT_ACCOUNT_TOKEN ?? '';
const URL = process.env.NOW_URL || process.env.HEROKU_URL || process.env.OCI_URL;
const PORT = ((process.env.PORT as unknown) as number) || 8080;
const HOST = '0.0.0.0';
console.log('URL: %s', URL);
console.log('PORT: %s', PORT);

connectDb()
  .then((db) => {
    const modules = getModules(db);
    configSchedulers(modules);
    const bot = initializeBot(TOKEN, modules);
    if (URL) {
      https.createServer(bot.middleware()).listen(PORT, HOST, () => bot.setWebhook(URL));
    } else {
      logger.debug(
        'Could not find the now.sh/Heroku environment variables. Please make sure you followed readme guide.',
      );
      ngrok
        .getPublicUrl()
        .then((publicUrl) => {
          http.createServer(bot.middleware()).listen(PORT, () => bot.setWebhook(publicUrl));
        })
        .catch((error) => {
          logger.debug('Can not connectDb to ngrok server. Is it running?');
          logger.error(error);
          process.exit(1);
        });
    }
  })
  .catch((err) => {
    console.log(`Initialize error: `, err);
  });
