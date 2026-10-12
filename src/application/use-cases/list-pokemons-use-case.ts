import { Pokemon } from '@domain/entities/pokemon';
import {
  PokemonFilters,
  PokemonRepositoryContract,
} from '@domain/repositories/pokemon-repository-contract';

export class ListPokemonsUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  execute(filters: PokemonFilters = {}): Promise<Pokemon[]> {
    return this.repository.findByFilters(filters);
  }
}
