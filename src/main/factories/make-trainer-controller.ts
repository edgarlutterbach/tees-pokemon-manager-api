import { pokemonRepository, trainerRepository } from './repositories';
import { CreateTrainerUseCase } from '@application/use-cases/create-trainer-use-case';
import { DeleteTrainerUseCase } from '@application/use-cases/delete-trainer-use-case';
import { ListTrainerTeamUseCase } from '@application/use-cases/list-trainer-team-use-case';
import { TrainerController } from '@infrastructure/http/controllers/trainer-controller';

export function makeTrainerController(): TrainerController {
  const createUseCase = new CreateTrainerUseCase(trainerRepository);
  const deleteUseCase = new DeleteTrainerUseCase(trainerRepository);
  const listTeamUseCase = new ListTrainerTeamUseCase(
    trainerRepository,
    pokemonRepository,
  );

  return new TrainerController(createUseCase, deleteUseCase, listTeamUseCase);
}