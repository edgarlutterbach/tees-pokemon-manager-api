import { Trainer } from '@domain/entities/trainer';
import { ForbiddenError } from '@domain/errors/forbidden-error';
import { NotFoundError } from '@domain/errors/not-found-error';
import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';
import { UpdateTrainerRoleDTO } from '@application/dtos/update-trainer-role-dto';

export class UpdateTrainerRoleUseCase {
  private repository: TrainerRepositoryContract;

  constructor(repository: TrainerRepositoryContract) {
    this.repository = repository;
  }

  async execute({
    trainerId,
    role,
    requesterId,
  }: UpdateTrainerRoleDTO): Promise<Trainer> {
    if (trainerId === requesterId) {
      throw new ForbiddenError('Você não pode alterar o próprio papel');
    }

    const trainer = await this.repository.findById(trainerId);

    if (!trainer) {
      throw new NotFoundError('Treinador não encontrado no banco de dados');
    }

    if (trainer.role === role) {
      return trainer;
    }

    const updatedTrainer = trainer.withRole(role);

    await this.repository.update(updatedTrainer);

    return updatedTrainer;
  }
}
