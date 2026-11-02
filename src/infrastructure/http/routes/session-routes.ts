import { Router } from 'express';
import { makeSessionController } from '@main/factories/make-session-controller';
import { validateRequest } from '@infrastructure/http/middlewares/validate-request';
import { authenticateTrainerSchema } from '@infrastructure/http/schemas/session-schemas';

const router = Router();
const controller = makeSessionController();

router.post(
  '/api/v1/sessions',
  validateRequest({ body: authenticateTrainerSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Sessions']
      #swagger.summary = 'Autentica um Treinador e emite um token JWT'
      #swagger.description = 'O token expira em 1 dia e deve ser enviado no cabeçalho Authorization como Bearer <token>.'
      #swagger.requestBody = {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/definitions/AuthenticateTrainerDto' } } }
      }
      #swagger.responses[200] = {
        description: 'Login realizado com sucesso',
        content: { 'application/json': { schema: { $ref: '#/definitions/Session' } } }
      }
      #swagger.responses[400] = {
        description: 'Dados de entrada inválidos',
        content: { 'application/json': { schema: { $ref: '#/definitions/SessionValidationError' } } }
      }
      #swagger.responses[401] = {
        description: 'E-mail ou senha inválidos',
        content: { 'application/json': { schema: { $ref: '#/definitions/InvalidCredentialsError' } } }
      }
    */
    return controller.create(req, res);
  },
);

export { router as sessionRoutes };
