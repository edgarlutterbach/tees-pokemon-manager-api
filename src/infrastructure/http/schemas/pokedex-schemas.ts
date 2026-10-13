import { z } from 'zod';
import { jsonBody } from '@infrastructure/http/schemas/schema-helpers';

export const pokedexSearchQuerySchema = jsonBody({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'O parâmetro name é obrigatório'
          : 'O parâmetro name deve ser informado uma única vez',
    })
    .trim()
    .min(1, 'O parâmetro name não pode ser vazio')
    .max(100, 'O parâmetro name deve ter no máximo 100 caracteres'),
});

export type PokedexSearchQuery = z.infer<typeof pokedexSearchQuerySchema>;
