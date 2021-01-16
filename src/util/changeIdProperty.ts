import { IId } from '../domain/Base';

const changeIdProperty = <O extends Partial<IId>>(object: O): void => {
  // eslint-disable-next-line no-param-reassign
  object._id = object.id;
  // eslint-disable-next-line no-param-reassign
  delete object.id;
};

export default changeIdProperty;
