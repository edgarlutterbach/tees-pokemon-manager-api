import { Router } from 'express';
import { makePokedexController } from '@main/factories/make-pokedex-controller';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import { pokedexSearchQuerySchema } from '@infrastructure/http/schemas/pokedex-schemas';

const router = Router();
const controller = makePokedexController();

router.get(
  '/api/v1/pokedex/search',
  validateRequest({ query: pokedexSearchQuerySchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Pokedex']
      #swagger.summary = 'Consulta um Pokémon na PokéAPI oficial'
      #swagger.description = 'Consulta direta à PokéAPI, sem acesso ao banco de dados. height é retornado em decímetros e weight em hectogramas.'
      #swagger.parameters['name'] = { in: 'query', required: true, type: 'string', description: 'Nome do Pokémon, sem diferenciar maiúsculas (ex: pikachu)' }
      #swagger.responses[200] = {
        description: 'Pokémon encontrado na PokéAPI',
        content: { 'application/json': { schema: { $ref: '#/definitions/PokedexEntry' } } }
      }
      #swagger.responses[400] = {
        description: 'Parâmetro name ausente, vazio ou repetido',
        content: { 'application/json': { schema: { $ref: '#/definitions/PokedexSearchValidationError' } } }
      }
      #swagger.responses[404] = {
        description: 'Nome não encontrado na base oficial da PokéAPI',
        content: { 'application/json': { schema: { $ref: '#/definitions/PokeApiNotFoundError' } } }
      }
      #swagger.responses[503] = {
        description: 'PokéAPI indisponível ou sem resposta em 3 segundos',
        content: { 'application/json': { schema: { $ref: '#/definitions/ServiceUnavailableError' } } }
      }
    */
    return controller.search(req, res);
  },
);

export { router as pokedexRoutes };
