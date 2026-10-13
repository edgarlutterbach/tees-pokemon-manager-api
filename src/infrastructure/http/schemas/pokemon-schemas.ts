import { z } from 'zod';
import { Pokemon } from '@domain/entities/pokemon';
import { PokemonType } from '@domain/entities/pokemon-type';
import { PokemonRarity } from '@domain/entities/pokemon-rarity';
import { CreatePokemonDTO } from '@application/dtos/create-pokemon-dto';
import {
  jsonBody,
  typeError,
} from '@infrastructure/http/schemas/schema-helpers';

const TYPES = Object.values(PokemonType).join(', ');
const RARITIES = Object.values(PokemonRarity).join(', ');

const positiveInteger = (field: string) =>
  z
    .number({ error: typeError(field, 'um número') })
    .int(`O campo ${field} deve ser um número inteiro`)
    .positive(`O campo ${field} deve ser maior que zero`);

export const createPokemonSchema = jsonBody({
  id: z
    .string({ error: typeError('id', 'um texto') })
    .trim()
    .min(1, 'O id não pode ser vazio')
    .max(50, 'O id deve ter no máximo 50 caracteres'),
  name: z
    .string({ error: typeError('name', 'um texto') })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres')
    .max(100, 'O nome deve ter no máximo 100 caracteres'),
  type: z.enum(PokemonType, {
    error: typeError('type', `um dos valores: ${TYPES}`),
  }),
  rarity: z.enum(PokemonRarity, {
    error: typeError('rarity', `um dos valores: ${RARITIES}`),
  }),
  hp: positiveInteger('hp'),
  attack: positiveInteger('attack'),
  defense: positiveInteger('defense'),
  nickname: z
    .string({ error: typeError('nickname', 'um texto') })
    .trim()
    .min(1, 'O apelido não pode ser vazio')
    .max(100, 'O apelido deve ter no máximo 100 caracteres')
    .optional(),
  level: z
    .number({ error: typeError('level', 'um número') })
    .int('O nível deve ser um número inteiro')
    .min(Pokemon.MIN_LEVEL, `O nível deve ser no mínimo ${Pokemon.MIN_LEVEL}`)
    .max(Pokemon.MAX_LEVEL, `O nível deve ser no máximo ${Pokemon.MAX_LEVEL}`)
    .optional(),
  trainerId: z
    .uuid({ error: 'O campo trainerId deve ser um UUID válido' })
    .optional(),
}) satisfies z.ZodType<CreatePokemonDTO>;

export type CreatePokemonInput = z.infer<typeof createPokemonSchema>;

const levelQueryParam = (field: string, fallback: number) =>
  z
    .string({ error: `O parâmetro ${field} deve ser informado uma única vez` })
    .trim()
    .regex(/^\d+$/, `O parâmetro ${field} deve ser um número inteiro`)
    .transform(Number)
    .pipe(
      z
        .number()
        .min(
          Pokemon.MIN_LEVEL,
          `O parâmetro ${field} deve ser no mínimo ${Pokemon.MIN_LEVEL}`,
        )
        .max(
          Pokemon.MAX_LEVEL,
          `O parâmetro ${field} deve ser no máximo ${Pokemon.MAX_LEVEL}`,
        ),
    )
    .default(fallback);

export const listPokemonsQuerySchema = jsonBody({
  type: z
    .string({ error: 'O parâmetro type deve ser informado uma única vez' })
    .trim()
    .toUpperCase()
    .pipe(
      z.enum(PokemonType, {
        error: `O parâmetro type deve ser um dos valores: ${TYPES}`,
      }),
    )
    .optional(),
  minLevel: levelQueryParam('minLevel', Pokemon.MIN_LEVEL),
  maxLevel: levelQueryParam('maxLevel', Pokemon.MAX_LEVEL),
}).refine((query) => query.minLevel <= query.maxLevel, {
  message: 'O parâmetro minLevel não pode ser maior que maxLevel',
  path: ['minLevel'],
  when: (payload) => payload.issues.length === 0,
});

export type ListPokemonQuery = z.infer<typeof listPokemonsQuerySchema>;
