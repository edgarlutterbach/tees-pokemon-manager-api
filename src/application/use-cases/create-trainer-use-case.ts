import { TrainerRepositoryContract } from '../../domain/repositories/trainer-repository-contract';
import { Trainer } from '../../domain/entities/trainer';
import { CreateTrainerDTO } from '../dtos/create-trainer-dto';
import { DomainError } from '../../domain/errors/domain-error';
import { ErrorCode } from '../../domain/errors/error-code';

export class CreateTrainerUseCase {
  private repository: TrainerRepositoryContract;

  constructor(repository: TrainerRepositoryContract) {
    this.repository = repository;
  }

  async execute(data: CreateTrainerDTO): Promise<Trainer> {
    if (data.age <= 0) {
      throw new DomainError(
        'A idade deve ser um número positivo.',
        ErrorCode.INVALID_ATTRIBUTES,
      );
    }

    const trainer: Trainer = {
      name: data.name,
      age: data.age,
      city: data.city,
    };

    await this.repository.create(trainer);

    return trainer;
  }
}
