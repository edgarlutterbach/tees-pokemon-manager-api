import { Pokemon } from '../entities/pokemon';

type AttackerStats = Pick<Pokemon, 'attack'>;
type DefenderStats = Pick<Pokemon, 'defense' | 'hp'>;

const MIN_DAMAGE = 0;

export function calculatePokemonDamage(
  attacker: AttackerStats,
  defender: DefenderStats,
): string {
  const baseDamage = Math.max(MIN_DAMAGE, attacker.attack - defender.defense);
  const totalHpRemaining = Math.max(0, defender.hp - baseDamage);

  return 'HP restante: ' + totalHpRemaining;
}
