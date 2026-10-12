import { Router } from 'express';
import { makeTrainerController } from '@main/factories/make-trainer-controller';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import { createTrainerSchema } from '@infrastructure/http/schemas/trainer-schemas';

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
        content: { 'application/json': { schema: { $ref: '#/definitions/ValidationError' } } }
      }
      #swagger.responses[409] = {
        description: 'Já existe um Treinador cadastrado com este e-mail',
        content: { 'application/json': { schema: { $ref: '#/definitions/TrainerConflictError' } } }
      }
    */
    return controller.create(req, res);
  },
);

export { router as trainerRoutes };
