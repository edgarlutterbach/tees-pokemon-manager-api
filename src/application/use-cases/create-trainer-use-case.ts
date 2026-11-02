import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';
import { HashProvider } from '@domain/providers/hash-provider';
import { Trainer } from '@domain/entities/trainer';
import { TrainerRole } from '@domain/entities/trainer-role';
import { CreateTrainerDTO } from '@application/dtos/create-trainer-dto';

export class CreateTrainerUseCase {
  private repository: TrainerRepositoryContract;
  private hashProvider: HashProvider;

  constructor(
    repository: TrainerRepositoryContract,
    hashProvider: HashProvider,
  ) {
    this.repository = repository;
    this.hashProvider = hashProvider;
  }

  async execute({
    name,
    email,
    age,
    city,
    password,
  }: CreateTrainerDTO): Promise<Trainer> {
    const hashedPassword = await this.hashProvider.generateHash(password);

    const trainer = new Trainer({
      name,
      email,
      age,
      city,
      password: hashedPassword,
      role: TrainerRole.USER,
    });

    await this.repository.create(trainer);

    return trainer;
  }
}
