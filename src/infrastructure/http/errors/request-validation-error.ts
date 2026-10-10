export interface ValidationIssue {
  field: string;
  message: string;
}

export class RequestValidationError extends Error {
  public readonly details: ValidationIssue[];

  constructor(details: ValidationIssue[]) {
    super('Dados de entrada inválidos');
    this.details = details;
    this.name = 'RequestValidationError';
  }
}
