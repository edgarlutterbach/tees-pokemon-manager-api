import { PokemonRarity } from '@domain/entities/pokemon-rarity';
import { ExternalSpeciesDetails } from '@domain/gateways/pokemon-external-gateway';

export const RARE_CAPTURE_RATE_LIMIT = 45;

export function classifyPokemonRarity(
  species: ExternalSpeciesDetails,
): PokemonRarity {
  if (species.isLegendary || species.isMythical) {
    return PokemonRarity.LEGENDARY;
  }

  if (species.captureRate <= RARE_CAPTURE_RATE_LIMIT) {
    return PokemonRarity.RARE;
  }

  return PokemonRarity.COMMON;
}
