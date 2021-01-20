import { IId } from '../domain/types/Base';
import logger from './logger';

/**
 * Заменяет свойство id, которое пришло от api football-data на свойство _id в mongoDb
 *
 * @param object
 */
const changeIdProperty = <O extends Partial<IId>>(object: O): O => {
  let result = { ...object };
  // eslint-disable-next-line no-prototype-builtins
  if (result && result.hasOwnProperty('id')) {
    // eslint-disable-next-line no-param-reassign
    delete result.id;
    result = {
      _id: object.id,
      ...result,
    };
    logger.debug('id changed for object: %s', result);
  }
  return result;
};

export default changeIdProperty;
