import * as http from 'http';
import { RequestOptions } from 'http';
import logger from '../../util/logger';
import { API } from '../../const';
import { IApiCompetition } from '../../domain/competitions/Competition';

const prefix = API.FOOTBALL_DATA_ORG.PREFIX;
// List one particular competition.
const competitions = API.FOOTBALL_DATA_ORG.COMPETITIONS;

const getOptions = (path: string): RequestOptions => ({
  host: 'api.football-data.org',
  path,
  method: 'GET',
  headers: {
    'X-Auth-Token': process.env.X_AUTH_TOKEN_API_FOOTBALL_DATA,
  },
});

const request = (options: RequestOptions): Promise<any> => {
  return new Promise<void>((resolve, reject) => {
    const request = http.request(options, (response) => {
      logger.debug(`statusCode: ${response.statusCode}`);

      response.setEncoding('utf8');
      let responseBody = '';

      response.on('data', (chunk) => {
        responseBody += chunk;
      });

      response.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(responseBody);
        } catch (error) {
          logger.error('Error parsing response data: %s', error);
          reject();
        }
        resolve(parsedData);
      });
    });

    request.on('error', (error) => {
      logger.error('Request error: %s', error);
      reject();
    });

    request.end();
  });
};

const getCompetition = async (code: string): Promise<IApiCompetition> => {
  let responseData;
  try {
    responseData = await request(getOptions(`/${prefix}/${competitions}/${code}/`));
    logger.debug('responseData: %s', responseData);
  } catch (error) {
    logger.error(error);
  }
  return responseData;
};

export default getCompetition;
