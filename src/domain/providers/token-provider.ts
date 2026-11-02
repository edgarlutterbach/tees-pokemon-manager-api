import { TrainerRole } from '@domain/entities/trainer-role';

export interface TokenPayload {
  subject: string;
  role: TrainerRole;
}

export interface TokenProvider {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
