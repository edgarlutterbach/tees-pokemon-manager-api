import { z } from 'zod';
import { CreateTrainerDTO } from '@application/dtos/create-trainer-dto';
import { CapturePokemonDTO } from '@application/dtos/capture-pokemon-dto';
import {
  TrainerParams,
  TrainerScopedParams,
} from '@application/dtos/trainer-params';
import {
  jsonBody,
  typeError,
} from '@infrastructure/http/schemas/schema-helpers';

export const createTrainerSchema = jsonBody({
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

export const trainerIdParamsSchema = z.object({
  id: z.uuid({ error: 'O parâmetro id deve ser um UUID válido' }),
}) satisfies z.ZodType<TrainerParams>;

export const trainerScopedParamsSchema = z.object({
  trainerId: z.uuid({ error: 'O parâmetro trainerId deve ser um UUID válido' }),
}) satisfies z.ZodType<TrainerScopedParams>;

export const capturePokemonSchema = jsonBody({
  name: z
    .string({ error: typeError('name', 'um texto') })
    .trim()
    .min(1, 'O nome não pode ser vazio')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  nickname: z
    .string({ error: typeError('nickname', 'um texto') })
    .trim()
    .min(1, 'O apelido não pode ser vazio')
    .max(100, 'O apelido deve ter no máximo 100 caracteres')
    .optional(),
}) satisfies z.ZodType<Omit<CapturePokemonDTO, 'trainerId'>>;

export type CapturePokemonInput = z.infer<typeof capturePokemonSchema>;
