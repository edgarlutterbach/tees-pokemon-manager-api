import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { PokeApiAxiosGateway } from '@infrastructure/gateways/poke-api-axios-gateway';
import { InMemoryPokemonGateway } from '@infrastructure/gateways/in-memory-pokemon-gateway';

function makePokemonExternalGateway(): PokemonExternalGateway {
  if (process.env.USE_EXTERNAL_API === 'false') {
    console.log('[gateway]: PokéAPI simulada em memória (modo offline)');
    return new InMemoryPokemonGateway();
  }

  console.log('[gateway]: PokéAPI oficial (modo integrado)');
  return new PokeApiAxiosGateway();
}

const pokemonExternalGateway = makePokemonExternalGateway();

export { pokemonExternalGateway };
