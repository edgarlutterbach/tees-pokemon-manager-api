import { z } from 'zod';
import { CreateTrainerDTO } from '@application/dtos/create-trainer-dto';

function typeError(field: string, expected: string) {
  return (issue: { input?: unknown }) =>
    issue.input === undefined
      ? `O campo ${field} é obrigatório`
      : `O campo ${field} deve ser ${expected}`;
}

export const createTrainerSchema = z.object({
  name: z
    .string({ error: typeError('name', 'um texto') })
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(150, 'O nome deve ter no máximo 150 caracteres'),
  email: z
    .string({ error: typeError('email', 'um texto') })
    .trim()
    .toLowerCase()
    .max(255, 'O e-mail deve ter no máximo 255 caracteres')
    .pipe(z.email('Formato de e-mail inválido')),
  age: z
    .number({ error: typeError('age', 'um número') })
    .int('A idade deve ser um número inteiro')
    .positive('A idade deve ser maior que zero'),
  city: z
    .string({ error: typeError('city', 'um texto') })
    .trim()
    .min(2, 'A cidade deve ter no mínimo 2 caracteres')
    .max(100, 'A cidade deve ter no máximo 100 caracteres'),
}) satisfies z.ZodType<CreateTrainerDTO>;

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;
