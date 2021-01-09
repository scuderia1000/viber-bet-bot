import * as http from 'http';
import ngrok from './util/get-public-url';
import initializeBot from './bot';
import { createLogger } from './util/logger';
import { connectDb } from './db';
import { DB } from './const';

const TOKEN = process.env.BOT_ACCOUNT_TOKEN ?? '';
const URL = process.env.NOW_URL || process.env.HEROKU_URL;
const PORT = process.env.PORT || 8080;
const logger = createLogger();

connectDb()
  .then(() => {
    const bot = initializeBot(TOKEN);

    if (URL) {
      http.createServer(bot.middleware()).listen(PORT, () => bot.setWebhook(URL));
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
    logger.error(DB.ERROR_CONNECTION);
    logger.error(err);
  });
