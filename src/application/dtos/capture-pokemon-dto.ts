import { TrainerRole } from '@domain/entities/trainer-role';

export interface CapturePokemonDTO {
  trainerId: string;
  name: string;
  nickname?: string;
  currentUserId: string;
  currentUserRole: TrainerRole;
}
