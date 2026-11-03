import { z } from 'zod';
import { CreateTrainerDTO } from '@application/dtos/create-trainer-dto';
import { CapturePokemonDTO } from '@application/dtos/capture-pokemon-dto';
import { UpdateTrainerRoleDTO } from '@application/dtos/update-trainer-role-dto';
import { TrainerRole } from '@domain/entities/trainer-role';
import {
  TrainerParams,
  TrainerScopedParams,
} from '@application/dtos/trainer-params';
import {
  fitsBcryptLimit,
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
  password: z
    .string({ error: typeError('password', 'um texto') })
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .refine(fitsBcryptLimit, 'A senha deve ter no máximo 72 bytes'),
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

export const updateTrainerRoleSchema = jsonBody({
  role: z.enum(TrainerRole, {
    error: (issue) =>
      issue.input === undefined
        ? 'O campo role é obrigatório'
        : `O campo role deve ser um dos valores: ${Object.values(TrainerRole).join(', ')}`,
  }),
}) satisfies z.ZodType<Pick<UpdateTrainerRoleDTO, 'role'>>;

export type UpdateTrainerRoleInput = z.infer<typeof updateTrainerRoleSchema>;
