import { Router } from 'express';
import { makePokemonController } from '@main/factories/make-pokemon-controller';

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

router.get('/api/v1/pokemons', (req, res) => {
  /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Lista todos os Pokémons'
      #swagger.description = 'Retorna o catálogo completo, com filtro opcional por tipo.'
      #swagger.parameters['type'] = { in: 'query', type: 'string', description: 'Filtra pelo tipo (ex: FIRE)' }
      #swagger.responses[200] = {
        description: 'Lista de Pokémons',
        content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/definitions/Pokemon' } } } }
      }
    */
  return controller.list(req, res);
});

router.get('/api/v1/pokemons/:id', (req, res) => {
  /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Busca um Pokémon pelo ID'
      #swagger.parameters['id'] = { description: 'ID do Pokémon' }
      #swagger.responses[200] = {
        description: 'Pokémon encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/Pokemon' } } }
      }
      #swagger.responses[404] = {
        description: 'Pokémon não encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/NotFoundError' } } }
      }
    */
  return controller.getById(req, res);
});

router.post('/api/v1/pokemons/', (req, res) => {
  /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Cadastra um novo Pokémon'
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/definitions/CreatePokemonDto' } } }
      }
      #swagger.responses[201] = { description: 'Pokémon criado com sucesso' }
      #swagger.responses[400] = {
        description: 'Dados inválidos',
        content: { 'application/json': { schema: { $ref: '#/definitions/BadRequestError' } } }
      }
      #swagger.responses[409] = {
        description: 'Já existe um Pokémon cadastrado com este ID',
        content: { 'application/json': { schema: { $ref: '#/definitions/ConflictError' } } }
      } 
    */
  return controller.create(req, res);
});

router.put('/api/v1/pokemons/:id', (req, res) => {
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
        description: 'Pokémon não encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/NotFoundError' } } }
      }
      #swagger.responses[400] = {
        description: 'Dados inválidos',
        content: { 'application/json': { schema: { $ref: '#/definitions/BadRequestError' } } }
      }  
    */
  return controller.update(req, res);
});

router.patch('/api/v1/pokemons/:id/level', (req, res) => {
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
        description: 'Nível ausente ou fora do intervalo permitido',
        content: { 'application/json': { schema: { $ref: '#/definitions/BadRequestError' } } }
      }
      #swagger.responses[404] = {
        description: 'Pokémon não encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/NotFoundError' } } }
      }
    */
  return controller.updateLevel(req, res);
});

router.delete('/api/v1/pokemons/:id', (req, res) => {
  /*
      #swagger.tags = ['Pokemons']
      #swagger.summary = 'Remove um Pokémon do catálogo'
      #swagger.parameters['id'] = { description: 'ID do Pokémon' }
      #swagger.responses[204] = { description: 'Pokémon removido com sucesso' }
      #swagger.responses[404] = {
        description: 'Pokémon não encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/NotFoundError' } } }
      }
    */
  return controller.delete(req, res);
});

export { router as pokemonRoutes };
