import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@domain/errors/domain-error';
import { ErrorCode } from '@domain/errors/error-code';

const statusCodeByErrorCode: Record<ErrorCode, number> = {
  [ErrorCode.INVALID_ATTRIBUTES]: 400,
  [ErrorCode.RESOURCE_NOT_FOUND]: 404,
  [ErrorCode.DUPLICATE_RESOURCE]: 409,
};

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): Response {
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
