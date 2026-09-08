import { ErrorCode } from './error-code';
import { DomainError } from './domain-error';

export class DuplicateResourceError extends DomainError {
  constructor(message: string) {
    super(message, ErrorCode.DUPLICATE_RESOURCE);
    this.name = 'DuplicateResourceError';
  }
}
