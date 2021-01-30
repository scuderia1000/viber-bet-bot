import { IObject } from '../types/Base';

class CommonObject implements IObject {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  equals(object: any): boolean {
    return this === object;
  }
}

export default CommonObject;
