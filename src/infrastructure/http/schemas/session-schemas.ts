import { z } from 'zod';
import { AuthenticateTrainerDTO } from '@application/dtos/authenticate-trainer-dto';
import {
  fitsBcryptLimit,
  jsonBody,
  typeError,
} from '@infrastructure/http/schemas/schema-helpers';

export const authenticateTrainerSchema = jsonBody({
  email: z
    .string({ error: typeError('email', 'um texto') })
    .trim()
    .toLowerCase()
    .pipe(z.email('Formato de e-mail inválido')),
  password: z
    .string({ error: typeError('password', 'um texto') })
    .min(1, 'A senha não pode ser vazia')
    .refine(fitsBcryptLimit, 'A senha deve ter no máximo 72 bytes'),
}) satisfies z.ZodType<AuthenticateTrainerDTO>;
