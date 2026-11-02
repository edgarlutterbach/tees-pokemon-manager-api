import { TrainerRole } from '@domain/entities/trainer-role';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: TrainerRole;
      };
    }
  }
}

export {};
