import { IObject } from '../types/Base';

class Object implements IObject {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  equals(object: any): boolean {
    return this === object;
  }
}

export default Object;
