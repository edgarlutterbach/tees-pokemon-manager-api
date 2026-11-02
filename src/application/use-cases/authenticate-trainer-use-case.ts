import { Trainer } from '@domain/entities/trainer';
import { UnauthorizedError } from '@domain/errors/unauthorized-error';
import { HashProvider } from '@domain/providers/hash-provider';
import { TokenProvider } from '@domain/providers/token-provider';
import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';
import { AuthenticateTrainerDTO } from '@application/dtos/authenticate-trainer-dto';

export interface AuthenticateTrainerResult {
  trainer: Trainer;
  token: string;
}

const INVALID_CREDENTIALS_MESSAGE = 'E-mail ou senha inválidos';

export class AuthenticateTrainerUseCase {
  private trainerRepository: TrainerRepositoryContract;
  private hashProvider: HashProvider;
  private tokenProvider: TokenProvider;

  constructor(
    trainerRepository: TrainerRepositoryContract,
    hashProvider: HashProvider,
    tokenProvider: TokenProvider,
  ) {
    this.trainerRepository = trainerRepository;
    this.hashProvider = hashProvider;
    this.tokenProvider = tokenProvider;
  }

  async execute({
    email,
    password,
  }: AuthenticateTrainerDTO): Promise<AuthenticateTrainerResult> {
    const trainer = await this.trainerRepository.findByEmail(email);

    if (!trainer) {
      throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await this.hashProvider.compareHash(
      password,
      trainer.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
    }

    const token = this.tokenProvider.generate({
      subject: trainer.id,
      role: trainer.role,
    });

    return { trainer, token };
  }
}
