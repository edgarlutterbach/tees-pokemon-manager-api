import { trainerRepository } from './repositories';
import { CreateTrainerUseCase } from '../../application/use-cases/create-trainer-use-case';
import { TrainerController } from '../../infrastructure/http/controllers/trainer-controller';

export function makeTrainerController(): TrainerController {
    const createUseCase = new CreateTrainerUseCase(trainerRepository);
    return new TrainerController(createUseCase);
}