import { NextFunction, Request, RequestHandler, Response } from 'express';
import { UnauthorizedError } from '@domain/errors/unauthorized-error';
import { TokenProvider } from '@domain/providers/token-provider';

const BEARER_PATTERN = /^Bearer\s+(\S+)$/i;

export function makeEnsureAuthenticated(
  tokenProvider: TokenProvider,
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new UnauthorizedError('Token JWT não fornecido'));
    }

    const match = BEARER_PATTERN.exec(authHeader.trim());

    if (!match) {
      return next(
        new UnauthorizedError('Formato do token inválido. Use: Bearer <token>'),
      );
    }

    try {
      const { subject, role } = tokenProvider.verify(match[1]);
      req.user = { id: subject, role };

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
