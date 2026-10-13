import { AppError } from './app-error';

export class ServiceUnavailableError extends AppError {
  constructor(message: string) {
    super(message, 503);
  }
}
