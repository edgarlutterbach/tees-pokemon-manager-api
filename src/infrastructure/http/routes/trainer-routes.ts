import { Router } from 'express';
import { makeTrainerController } from '@main/factories/make-trainer-controller';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import {
  createTrainerSchema,
  trainerIdParamsSchema,
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

export { router as trainerRoutes };
