import * as http from 'http';
import ngrok from './util/get-public-url';
import createLogger from './util/logger';
import initializeBot from './bot';

const TOKEN = process.env.BOT_ACCOUNT_TOKEN ?? '';
const URL = process.env.NOW_URL || process.env.HEROKU_URL;
const PORT = process.env.PORT || 8080;

const logger = createLogger();
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
      logger.debug('Can not connect to ngrok server. Is it running? 1111');
      logger.error(error);
      process.exit(1);
    });
}
