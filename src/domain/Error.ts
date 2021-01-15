import { IError } from './Base';

class Error implements IError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export default Error;
