import { trainerRepository } from './repositories';
import { hashProvider, tokenProvider } from './providers';
import { AuthenticateTrainerUseCase } from '@application/use-cases/authenticate-trainer-use-case';
import { SessionController } from '@infrastructure/http/controllers/session-controller';

export function makeSessionController(): SessionController {
  const authenticateUseCase = new AuthenticateTrainerUseCase(
    trainerRepository,
    hashProvider,
    tokenProvider,
  );

  return new SessionController(authenticateUseCase);
}
