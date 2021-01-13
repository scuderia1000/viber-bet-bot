import * as http from 'http';
import { RequestOptions } from 'http';
import logger from '../../util/logger';

const prefix = '/v2';
// List one particular competition.
const competitions = '/competitions';
// код лиги чемпионов
const championsLeague = '/CL';

const getOptions = (path: string): RequestOptions => ({
  hostname: 'http://api.football-data.org',
  path,
  method: 'GET',
  headers: {
    'X-Auth-Token': process.env.X_AUTH_TOKEN_API_FOOTBALL_DATA,
  },
});

const request = (options: RequestOptions): void => {
  logger.debug('request options:', options);

  const request = http.request(options, (response) => {
    logger.debug(`statusCode: ${response.statusCode}`);

    response.on('data', (data) => {
      logger.debug(`response data: ${data}`);
    });
  });

  request.on('error', (error) => {
    logger.error(error);
  });

  request.end();
};

const getCompetition = (code = championsLeague): void => {
  request(getOptions(`${prefix}${competitions}${code}/`));
};

export default getCompetition;
