import { IError } from './types/Base';

class Error implements IError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export default Error;
