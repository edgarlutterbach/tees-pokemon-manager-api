import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';

export class DeleteTrainerUseCase {
  private repository: TrainerRepositoryContract;

  constructor(repository: TrainerRepositoryContract) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
