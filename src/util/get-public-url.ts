import * as http from 'http';
import { RequestOptions } from 'http';
import { NgrokConfig } from '../types/base';

const options: RequestOptions = {
  hostname: '127.0.0.1',
  port: 4040,
  path: '/api/tunnels',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const ngrok = {
  getPublicUrl: (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const request = http.request(options, (response) => {
        response.setEncoding('utf-8');
        response.on('data', (data: string): void => {
          const config: NgrokConfig = JSON.parse(data);
          const httpTunnel = config.tunnels.filter((t) => t.proto === 'https').pop();
          resolve(httpTunnel?.pulic_url);
        });
      });

      request.on('error', (e) => {
        reject(e.message);
      });
      request.end();
    });
  },
};

export default ngrok;
