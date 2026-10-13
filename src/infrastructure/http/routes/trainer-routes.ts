import { Router } from 'express';
import { makeTrainerController } from '@main/factories/make-trainer-controller';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import {
  capturePokemonSchema,
  createTrainerSchema,
  trainerIdParamsSchema,
  trainerScopedParamsSchema,
} from '@infrastructure/http/schemas/trainer-schemas';

const router = Router();
const controller = makeTrainerController();

router.post(
  '/api/v1/trainers/',
  validateRequest({ body: createTrainerSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Cadastra um novo Treinador'
      #swagger.description = 'O e-mail é único: cadastros repetidos retornam 409.'
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/definitions/CreateTrainerDto' } } }
      }
      #swagger.responses[201] = {
        description: 'Treinador cadastrado com sucesso',
        content: { 'application/json': { schema: { $ref: '#/definitions/Trainer' } } }
      }
      #swagger.responses[400] = {
        description: 'Dados de entrada inválidos',
        content: { 'application/json': { schema: { $ref: '#/definitions/CreateTrainerValidationError' } } }
      }
      #swagger.responses[409] = {
        description: 'Já existe um Treinador cadastrado com este e-mail',
        content: { 'application/json': { schema: { $ref: '#/definitions/TrainerConflictError' } } }
      }
    */
    return controller.create(req, res);
  },
);

router.delete(
  '/api/v1/trainers/:id',
  validateRequest({ params: trainerIdParamsSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Remove um Treinador'
      #swagger.description = 'Os Pokémons do treinador não são removidos: ficam sem treinador (selvagens).'
      #swagger.parameters['id'] = { description: 'ID (UUID) do Treinador' }
      #swagger.responses[204] = { description: 'Treinador removido com sucesso' }
      #swagger.responses[400] = {
        description: 'ID em formato inválido',
        content: { 'application/json': { schema: { $ref: '#/definitions/TrainerIdValidationError' } } }
      }
      #swagger.responses[404] = {
        description: 'Treinador não encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/TrainerNotFoundError' } } }
      }
    */
    return controller.delete(req, res);
  },
);

router.get(
  '/api/v1/trainers/:trainerId/team',
  validateRequest({ params: trainerScopedParamsSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Lista o time atual do Treinador'
      #swagger.description = 'Retorna os Pokémons associados ao treinador, na ordem em que foram capturados. O time tem no máximo 6 Pokémons.'
      #swagger.parameters['trainerId'] = { description: 'ID (UUID) do Treinador' }
      #swagger.responses[200] = {
        description: 'Time do treinador, que pode estar vazio',
        content: { 'application/json': { schema: { $ref: '#/definitions/TrainerTeam' } } }
      }
      #swagger.responses[400] = {
        description: 'ID em formato inválido',
        content: { 'application/json': { schema: { $ref: '#/definitions/TrainerScopedValidationError' } } }
      }
      #swagger.responses[404] = {
        description: 'Treinador não encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/TrainerNotFoundError' } } }
      }
    */
    return controller.team(req, res);
  },
);

router.post(
  '/api/v1/trainers/:trainerId/captures',
  validateRequest({
    params: trainerScopedParamsSchema,
    body: capturePokemonSchema,
  }),
  (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Captura um Pokémon para o time do Treinador'
      #swagger.description = 'Consulta a PokéAPI para obter tipo principal, atributos base, imagem e raridade. A raridade é LEGENDARY para lendários e míticos, RARE para capture_rate até 45 e COMMON nos demais casos. O time tem no máximo 6 Pokémons.'
      #swagger.parameters['trainerId'] = { description: 'ID (UUID) do Treinador' }
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/definitions/CapturePokemonDto' } } }
      }
      #swagger.responses[201] = {
        description: 'Pokémon capturado e adicionado ao time',
        content: { 'application/json': { schema: { $ref: '#/definitions/CapturedPokemon' } } }
      }
      #swagger.responses[400] = {
        description: 'trainerId inválido ou corpo da requisição inválido',
        content: { 'application/json': { schema: { $ref: '#/definitions/CapturePokemonValidationError' } } }
      }
      #swagger.responses[404] = {
        description: 'Treinador não encontrado ou nome inexistente na PokéAPI',
        content: { 'application/json': { schema: { $ref: '#/definitions/PokeApiNotFoundError' } } }
      }
      #swagger.responses[409] = {
        description: 'Time do treinador já possui 6 Pokémons',
        content: { 'application/json': { schema: { $ref: '#/definitions/TeamFullError' } } }
      }
      #swagger.responses[503] = {
        description: 'PokéAPI indisponível ou sem resposta em 3 segundos',
        content: { 'application/json': { schema: { $ref: '#/definitions/ServiceUnavailableError' } } }
      }
    */
    return controller.capture(req, res);
  },
);

export { router as trainerRoutes };
