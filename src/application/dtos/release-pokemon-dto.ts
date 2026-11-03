import { TrainerRole } from '@domain/entities/trainer-role';

export interface ReleasePokemonDTO {
  pokemonId: string;
  currentUserId: string;
  currentUserRole: TrainerRole;
}
