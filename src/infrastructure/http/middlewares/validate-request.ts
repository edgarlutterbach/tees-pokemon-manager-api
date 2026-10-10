import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodType } from 'zod';
import {
  RequestValidationError,
  ValidationIssue,
} from '@domain/errors/request-validation-error';

type RequestSource = 'body' | 'query' | 'params';

type RequestValidationSchemas = Partial<Record<RequestSource, ZodType>>;

const SOURCES: RequestSource[] = ['params', 'query', 'body'];

export function validateRequest(
  schemas: RequestValidationSchemas,
): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const issues: ValidationIssue[] = [];

    for (const source of SOURCES) {
      const schema = schemas[source];

      if (!schema) {
        continue;
      }

      const result = await schema.safeParseAsync(req[source]);

      if (!result.success) {
        for (const issue of result.error.issues) {
          issues.push({
            field: issue.path.join('.') || source,
            message: issue.message,
          });
        }
        continue;
      }

      Object.defineProperty(req, source, {
        value: result.data,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }

    if (issues.length > 0) {
      return next(new RequestValidationError(issues));
    }

    return next();
  };
}
