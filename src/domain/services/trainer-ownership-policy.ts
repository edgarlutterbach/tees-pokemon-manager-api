import { TrainerRole } from '@domain/entities/trainer-role';

export interface Requester {
  id: string;
  role: TrainerRole;
}

export function canActOnTrainer(
  requester: Requester,
  trainerId: string | undefined,
): boolean {
  return requester.role === TrainerRole.ADMIN || requester.id === trainerId;
}
