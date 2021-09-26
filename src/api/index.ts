import http, { RequestOptions } from 'http';
import logger from '../util/logger';

interface IRequestOptions {
  get(path: string): RequestOptions;
  post(): RequestOptions;
  put(contentType: string): RequestOptions;
}

const send = (options: RequestOptions, data?: any): Promise<any> => {
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
      reject(error);
    });

    if (data) {
      request.write(data);
    }

    request.end();
  });
};

export const sendRequest = async (options: RequestOptions, data?: any): Promise<any> => {
  let responseData;
  try {
    responseData = await send(options, data);
    logger.debug('responseData: %s', responseData);
  } catch (error) {
    logger.error(error);
  }
  return responseData;
};

export const options = (host: string, auth?: string): IRequestOptions => {
  const get = (path: string) => ({
    host,
    path,
    method: 'GET',
    headers: {
      'X-Auth-Token': auth,
    },
  });

  const post = () => ({
    host,
    method: 'POST',
  });

  const put = (contentType: string) => ({
    host,
    method: 'PUT',
    'x-date': new Date(),
    headers: {
      'Content-Type': contentType,
      'Content-Length': 0,
    },
  });

  return {
    get,
    post,
    put,
  };
};
