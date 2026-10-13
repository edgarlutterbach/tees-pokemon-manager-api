import { ValidationError } from '@domain/errors/validation-error';

export interface ValidationIssue {
  field: string;
  message: string;
}

export class RequestValidationError extends ValidationError {
  constructor(details: ValidationIssue[]) {
    super('Dados de entrada inválidos', details);
  }
}
