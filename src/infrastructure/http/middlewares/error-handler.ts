import { Request, Response, NextFunction } from 'express';
import { AppError } from '@domain/errors/app-error';
import { Prisma } from '@prisma/client';
import { PrismaErrorMapper } from '@infrastructure/database/prisma/prisma-error-mapper';

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

function sendAppError(res: Response, error: AppError): Response {
  const payload: Record<string, unknown> = {
    status: 'error',
    statusCode: error.statusCode,
    message: error.message,
  };

  if (error.details !== undefined) {
    payload.details = error.details;
  }

  return res.status(error.statusCode).json(payload);
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (error instanceof AppError) {
    return sendAppError(res, error);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const mappedError = PrismaErrorMapper.toAppError(error);

    if (mappedError) {
      return sendAppError(res, mappedError);
    }
  }

  if (isBodyParserError(error)) {
    return res.status(error.status).json({
      status: 'error',
      statusCode: error.status,
      message: bodyParserMessages[error.type] ?? 'Corpo da requisição inválido',
    });
  }

  console.error('[Unhandled System Error]:', error);

  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Erro interno no servidor.',
  });
}
