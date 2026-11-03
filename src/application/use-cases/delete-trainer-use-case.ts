import { ForbiddenError } from '@domain/errors/forbidden-error';
import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';

export class DeleteTrainerUseCase {
  private repository: TrainerRepositoryContract;

  constructor(repository: TrainerRepositoryContract) {
    this.repository = repository;
  }

  async execute(id: string, requesterId: string): Promise<void> {
    if (id === requesterId) {
      throw new ForbiddenError('Você não pode excluir a própria conta');
    }

    await this.repository.delete(id);
  }
}
