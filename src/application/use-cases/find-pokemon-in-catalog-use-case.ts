import { PokemonRepositoryContract } from '../../domain/repositories/pokemon-repository-contract';
import { Pokemon } from '../../domain/entities/pokemon';

export type SearchIdentifier = string | number;

export class FindPokemonInCatalogUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(identifier: SearchIdentifier): Promise<Pokemon | null> {
    if (typeof identifier === 'number') {
      return this.repository.findById(String(identifier));
    }

    const allPokemons = await this.repository.findAll();
    const pokemon = allPokemons.find(
      (p) => p.name.toLowerCase() === identifier.toLowerCase(),
    );

    return pokemon ?? null;
  }
}
