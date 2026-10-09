import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';
import { Trainer } from '@domain/entities/trainer';
import { CreateTrainerDTO } from '@application/dtos/create-trainer-dto';

export class CreateTrainerUseCase {
  private repository: TrainerRepositoryContract;

  constructor(repository: TrainerRepositoryContract) {
    this.repository = repository;
  }

  async execute(data: CreateTrainerDTO): Promise<Trainer> {
    const trainer = new Trainer(data);

    await this.repository.create(trainer);

    return trainer;
  }
}
