import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@domain/errors/domain-error';
import { ErrorCode } from '@domain/errors/error-code';
import { RequestValidationError } from '@infrastructure/http/errors/request-validation-error';

const statusCodeByErrorCode: Record<ErrorCode, number> = {
  [ErrorCode.INVALID_ATTRIBUTES]: 400,
  [ErrorCode.RESOURCE_NOT_FOUND]: 404,
  [ErrorCode.DUPLICATE_RESOURCE]: 409,
};

interface BodyParserError extends Error {
  type: string;
  status: number;
}

const bodyParserMessages: Record<string, string> = {
  'entity.parse.failed': 'O corpo da requisição não é um JSON válido',
  'entity.too.large': 'O corpo da requisição excede o tamanho máximo permitido',
};

function isBodyParserError(error: Error): error is BodyParserError {
  return (
    'type' in error &&
    typeof error.type === 'string' &&
    'status' in error &&
    typeof error.status === 'number' &&
    error.status >= 400 &&
    error.status < 500
  );
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (error instanceof RequestValidationError) {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: error.message,
      details: error.details,
    });
  }

  if (isBodyParserError(error)) {
    return res.status(error.status).json({
      status: 'error',
      statusCode: error.status,
      message: bodyParserMessages[error.type] ?? 'Corpo da requisição inválido',
    });
  }

  if (error instanceof DomainError) {
    const statusCode = statusCodeByErrorCode[error.code] ?? 400;

    return res.status(statusCode).json({
      status: 'error',
      statusCode,
      message: error.message,
    });
  }

  console.error('[Uncaught Exception]:', error);

  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Erro interno no servidor.',
  });
}
