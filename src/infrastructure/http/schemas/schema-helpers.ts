import { z } from 'zod';

export function typeError(field: string, expected: string) {
  return (issue: { input?: unknown }) =>
    issue.input === undefined
      ? `O campo ${field} é obrigatório`
      : `O campo ${field} deve ser ${expected}`;
}

export function jsonBody<Shape extends z.ZodRawShape>(shape: Shape) {
  return z.object(shape, {
    error: 'O corpo da requisição deve ser um objeto JSON',
  });
}

const BCRYPT_MAX_BYTES = 72;

export function fitsBcryptLimit(value: string): boolean {
  return Buffer.byteLength(value, 'utf8') <= BCRYPT_MAX_BYTES;
}
