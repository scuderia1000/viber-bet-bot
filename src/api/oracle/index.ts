import { options, sendRequest } from '../index';
import logger from '../../util/logger';

interface IObjectStorage {
  upload(data: Uint8Array, contentType: string, fileName: string): Promise<any>;
}

const objectStorage = (): IObjectStorage => {
  const host = `${process.env.OCI_HOST}${process.env.OCI_PRE_AUTH_REQUEST_URL}/n/${process.env.OCI_BUCKET_NAMESPACE}/b/${process.env.OCI_BUCKET_NAME}`;

  const upload = async (data: Uint8Array, contentType: string, fileName: string): Promise<any> => {
    const requestOptions = options(`${host}/o/${fileName}`);
    logger.debug('requestOptions put: %s', requestOptions.put(contentType));
    const response = await sendRequest(requestOptions.put(contentType), data);
    return response;
  };

  return {
    upload,
  };
};

export default objectStorage;
