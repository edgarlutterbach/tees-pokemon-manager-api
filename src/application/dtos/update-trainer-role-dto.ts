import { TrainerRole } from '@domain/entities/trainer-role';

export interface UpdateTrainerRoleDTO {
  trainerId: string;
  role: TrainerRole;
  requesterId: string;
}
