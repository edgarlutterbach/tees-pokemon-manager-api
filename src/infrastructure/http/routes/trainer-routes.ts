import { Router } from 'express';
import { makeTrainerController } from '../../../main/factories/make-trainer-controller';

const router = Router();
const controller = makeTrainerController();

router.post('/', (req, res) => controller.create(req, res));

export { router as trainerRoutes };