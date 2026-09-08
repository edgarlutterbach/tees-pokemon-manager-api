import { Router } from 'express';
import { makeTrainerController } from '../../../main/factories/make-trainer-controller';

const router = Router();
const controller = makeTrainerController();

router.post('/api/v1/trainers/', (req, res) => {
    /*
      #swagger.tags = ['Trainers']
      #swagger.summary = 'Cadastra um novo Treinador'
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/definitions/CreateTrainerDto' } } }
      }
      #swagger.responses[201] = { description: 'Treinador cadastrado com sucesso' }
      #swagger.responses[400] = {
        description: 'Dados inválidos',
      }
    */
    return controller.create(req, res);
});

export { router as trainerRoutes };