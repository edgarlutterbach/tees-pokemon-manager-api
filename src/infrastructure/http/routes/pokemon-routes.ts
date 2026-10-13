import { Router } from 'express';
import { makePokemonController } from '@main/factories/make-pokemon-controller';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import {
  createPokemonSchema,
  listPokemonsQuerySchema,
  pokemonIdParamsSchema,
  updatePokemonLevelSchema,
  updatePokemonSchema,
} from '@infrastructure/http/schemas/pokemon-schemas';

const router = Router();
const controller = makePokemonController();

router.get('/api/v1/pokemons/stats', (req, res) => {
  /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Estatísticas gerais do catálogo'
      #swagger.description = 'Retorna o total de Pokémons cadastrados e a contagem por tipo.'
    */
  return controller.stats(req, res);
});

router.get(
  '/api/v1/pokemons',
  validateRequest({ query: listPokemonsQuerySchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Lista os Pokémons do catálogo de forma paginada'
      #swagger.description = 'Retorna o catálogo ordenado por nome, com paginação e filtros opcionais por tipo e faixa de nível.'
      #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Número da página, a partir de 1 (padrão: 1)' }
      #swagger.parameters['limit'] = { in: 'query', type: 'integer', description: 'Itens por página, de 1 a 50 (padrão: 10)' }
      #swagger.parameters['type'] = { in: 'query', type: 'string', description: 'Um dos 18 tipos oficiais, sem diferenciar maiúsculas (ex: FIRE, WATER, NORMAL)' }
      #swagger.parameters['minLevel'] = { in: 'query', type: 'integer', description: 'Nível mínimo, de 1 a 100 (padrão: 1)' }
      #swagger.parameters['maxLevel'] = { in: 'query', type: 'integer', description: 'Nível máximo, de 1 a 100 (padrão: 100)' }
      #swagger.responses[200] = {
        description: 'Página de Pokémons com metadados de paginação',
        content: { 'application/json': { schema: { $ref: '#/definitions/PaginatedPokemons' } } }
      }
      #swagger.responses[400] = {
        description: 'Parâmetros de busca inválidos',
        content: { 'application/json': { schema: { $ref: '#/definitions/ListPokemonsValidationError' } } }
      }
    */
    return controller.list(req, res);
  },
);

router.get(
  '/api/v1/pokemons/:id',
  validateRequest({ params: pokemonIdParamsSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Busca um Pokémon pelo ID'
      #swagger.parameters['id'] = { description: 'ID do Pokémon' }
      #swagger.responses[200] = {
        description: 'Pokémon encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/Pokemon' } } }
      }
      #swagger.responses[400] = {
        description: 'ID com mais de 50 caracteres',
        content: { 'application/json': { schema: { $ref: '#/definitions/PokemonIdValidationError' } } }
      }
      #swagger.responses[404] = {
        description: 'Pokémon não encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/NotFoundError' } } }
      }
    */
    return controller.getById(req, res);
  },
);

router.post(
  '/api/v1/pokemons/',
  validateRequest({ body: createPokemonSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Cadastra um novo Pokémon'
      #swagger.description = 'O nome é consultado na PokéAPI oficial, que fornece spriteUrl, baseExperience, height (decímetros) e weight (hectogramas). Esses quatro campos não são aceitos no corpo.'
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/definitions/CreatePokemonDto' } } }
      }
      #swagger.responses[201] = {
        description: 'Pokémon criado e enriquecido com os dados da PokéAPI',
        content: { 'application/json': { schema: { $ref: '#/definitions/CreatedPokemon' } } }
      }
      #swagger.responses[400] = {
        description: 'Dados de entrada inválidos',
        content: { 'application/json': { schema: { $ref: '#/definitions/CreatePokemonValidationError' } } }
      }
      #swagger.responses[404] = {
        description: 'Nome não encontrado na base oficial da PokéAPI',
        content: { 'application/json': { schema: { $ref: '#/definitions/PokeApiNotFoundError' } } }
      }
      #swagger.responses[409] = {
        description: 'ID de Pokémon já cadastrado ou time do treinador completo (máximo de 6)',
        content: { 'application/json': { schema: { $ref: '#/definitions/ConflictError' } } }
      }
      #swagger.responses[503] = {
        description: 'PokéAPI indisponível ou sem resposta em 3 segundos',
        content: { 'application/json': { schema: { $ref: '#/definitions/ServiceUnavailableError' } } }
      }
    */
    return controller.create(req, res);
  },
);

router.put(
  '/api/v1/pokemons/:id',
  validateRequest({ params: pokemonIdParamsSchema, body: updatePokemonSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Atualiza um Pokémon existente'
      #swagger.parameters['id'] = { description: 'ID do Pokémon' }
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/definitions/UpdatePokemonDto' } } }
      }
      #swagger.responses[200] = { description: 'Pokémon atualizado com sucesso' }
      #swagger.responses[404] = {
        description: 'Pokémon não encontrado no catálogo ou novo nome inexistente na PokéAPI',
        content: { 'application/json': { schema: { $ref: '#/definitions/NotFoundError' } } }
      }
      #swagger.responses[400] = {
        description: 'Dados de entrada inválidos ou corpo sem campos para atualizar',
        content: { 'application/json': { schema: { $ref: '#/definitions/UpdatePokemonValidationError' } } }
      }
      #swagger.responses[503] = {
        description: 'PokéAPI indisponível ou sem resposta em 3 segundos',
        content: { 'application/json': { schema: { $ref: '#/definitions/ServiceUnavailableError' } } }
      }
    */
    return controller.update(req, res);
  },
);

router.patch(
  '/api/v1/pokemons/:id/level',
  validateRequest({
    params: pokemonIdParamsSchema,
    body: updatePokemonLevelSchema,
  }),
  (req, res) => {
    /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Atualiza o nível de um Pokémon'
      #swagger.description = 'Altera apenas o nível do Pokémon. O valor deve ser um inteiro entre 1 e 100.'
      #swagger.parameters['id'] = { description: 'ID do Pokémon' }
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/definitions/UpdatePokemonLevelDto' } } }
      }
      #swagger.responses[200] = {
        description: 'Nível atualizado com sucesso',
        content: { 'application/json': { schema: { $ref: '#/definitions/Pokemon' } } }
      }
      #swagger.responses[400] = {
        description: 'ID inválido, nível ausente, não inteiro ou fora do intervalo de 1 a 100',
        content: { 'application/json': { schema: { $ref: '#/definitions/UpdatePokemonLevelValidationError' } } }
      }
      #swagger.responses[404] = {
        description: 'Pokémon não encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/NotFoundError' } } }
      }
    */
    return controller.updateLevel(req, res);
  },
);

router.delete(
  '/api/v1/pokemons/:id',
  validateRequest({ params: pokemonIdParamsSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Remove um Pokémon do catálogo'
      #swagger.parameters['id'] = { description: 'ID do Pokémon' }
      #swagger.responses[204] = { description: 'Pokémon removido com sucesso' }
      #swagger.responses[400] = {
        description: 'ID com mais de 50 caracteres',
        content: { 'application/json': { schema: { $ref: '#/definitions/PokemonIdValidationError' } } }
      }
      #swagger.responses[404] = {
        description: 'Pokémon não encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/NotFoundError' } } }
      }
    */
    return controller.delete(req, res);
  },
);

export { router as pokemonRoutes };
