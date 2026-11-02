import { NextFunction, Request, RequestHandler, Response } from 'express';
import { TrainerRole } from '@domain/entities/trainer-role';
import { ForbiddenError } from '@domain/errors/forbidden-error';
import { UnauthorizedError } from '@domain/errors/unauthorized-error';

export function ensureRole(roles: TrainerRole[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Usuário não autenticado'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError('Você não tem permissão para acessar este recurso'),
      );
    }

    return next();
  };
}
