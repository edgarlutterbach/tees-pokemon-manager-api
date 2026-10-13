import { pokemonExternalGateway } from './gateways';
import { SearchPokedexUseCase } from '@application/use-cases/search-pokedex-use-case';
import { PokedexController } from '@infrastructure/http/controllers/pokedex-controller';

export function makePokedexController(): PokedexController {
  const searchUseCase = new SearchPokedexUseCase(pokemonExternalGateway);

  return new PokedexController(searchUseCase);
}
