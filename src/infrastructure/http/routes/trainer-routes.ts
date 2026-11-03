import { Router } from 'express';
import { makeTrainerController } from '@main/factories/make-trainer-controller';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import { ensureRole } from '@infrastructure/http/middlewares/ensure-role';
import { ensureAuthenticated } from '@main/factories/middlewares';
import { TrainerRole } from '@domain/entities/trainer-role';
import {
  capturePokemonSchema,
  createTrainerSchema,
  trainerIdParamsSchema,
  trainerScopedParamsSchema,
  updateTrainerRoleSchema,
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
  ensureAuthenticated,
  ensureRole([TrainerRole.ADMIN]),
  validateRequest({ params: trainerIdParamsSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Remove um Treinador'
      #swagger.description = 'Os Pokémons do treinador não são removidos: ficam sem treinador (selvagens).'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = { description: 'ID (UUID) do Treinador' }
      #swagger.responses[204] = { description: 'Treinador removido com sucesso' }
      #swagger.responses[400] = {
        description: 'ID em formato inválido',
        content: { 'application/json': { schema: { $ref: '#/definitions/TrainerIdValidationError' } } }
      }
      #swagger.responses[401] = {
        description: 'Token ausente, inválido ou expirado',
        content: { 'application/json': { schema: { $ref: '#/definitions/UnauthorizedError' } } }
      }
      #swagger.responses[403] = {
        description: 'Exclusivo para ADMIN, ou tentativa de excluir a própria conta',
        content: { 'application/json': { schema: { $ref: '#/definitions/ForbiddenError' } } }
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
  ensureAuthenticated,
  validateRequest({
    params: trainerScopedParamsSchema,
    body: capturePokemonSchema,
  }),
  (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Captura um Pokémon para o time do Treinador'
      #swagger.description = 'Consulta a PokéAPI para obter tipo principal, atributos base, imagem e raridade. A raridade é LEGENDARY para lendários e míticos, RARE para capture_rate até 45 e COMMON nos demais casos. O time tem no máximo 6 Pokémons. USER só captura para o próprio time; ADMIN pode capturar para qualquer treinador.'
      #swagger.security = [{ "bearerAuth": [] }]
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
      #swagger.responses[401] = {
        description: 'Token ausente, inválido ou expirado',
        content: { 'application/json': { schema: { $ref: '#/definitions/UnauthorizedError' } } }
      }
      #swagger.responses[403] = {
        description: 'USER tentando capturar para o time de outro treinador',
        content: { 'application/json': { schema: { $ref: '#/definitions/CaptureForbiddenError' } } }
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

router.patch(
  '/api/v1/trainers/:id/role',
  ensureAuthenticated,
  ensureRole([TrainerRole.ADMIN]),
  validateRequest({
    params: trainerIdParamsSchema,
    body: updateTrainerRoleSchema,
  }),
  (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Altera o papel de um Treinador'
      #swagger.description = 'Exclusivo para ADMIN. Um administrador não pode alterar o próprio papel. O novo papel só vale nos tokens emitidos após a alteração.'
      #swagger.security = [{ "bearerAuth": [] }]
      #swagger.parameters['id'] = { description: 'ID (UUID) do Treinador' }
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/definitions/UpdateTrainerRoleDto' } } }
      }
      #swagger.responses[200] = {
        description: 'Papel atualizado com sucesso',
        content: { 'application/json': { schema: { $ref: '#/definitions/UpdatedTrainerRole' } } }
      }
      #swagger.responses[400] = {
        description: 'ID ou papel inválido',
        content: { 'application/json': { schema: { $ref: '#/definitions/UpdateTrainerRoleValidationError' } } }
      }
      #swagger.responses[401] = {
        description: 'Token ausente, inválido ou expirado',
        content: { 'application/json': { schema: { $ref: '#/definitions/UnauthorizedError' } } }
      }
      #swagger.responses[403] = {
        description: 'Requisição de quem não é ADMIN, ou tentativa de alterar o próprio papel',
        content: { 'application/json': { schema: { $ref: '#/definitions/ForbiddenError' } } }
      }
      #swagger.responses[404] = {
        description: 'Treinador não encontrado',
        content: { 'application/json': { schema: { $ref: '#/definitions/TrainerNotFoundError' } } }
      }
    */
    return controller.updateRole(req, res);
  },
);

export { router as trainerRoutes };
