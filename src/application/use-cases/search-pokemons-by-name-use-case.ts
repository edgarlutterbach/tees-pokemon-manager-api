import { Pokemon } from '@domain/entities/pokemon';
import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { ValidationError } from '@domain/errors/validation-error';

export interface SearchPokemonsResult {
  term: string;
  totalMatches: number;
  totalCatalog: number;
  data: Pokemon[];
}

export class SearchPokemonsByNameUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(term: string): Promise<SearchPokemonsResult> {
    const normalizedTerm = term?.trim();

    if (!normalizedTerm) {
      throw new ValidationError('O parâmetro nome é obrigatório para a busca.');
    }

    const [pokemons, totalCatalog] = await Promise.all([
      this.repository.searchByName(normalizedTerm),
      this.repository.count(),
    ]);

    return {
      term: normalizedTerm,
      totalMatches: pokemons.length,
      totalCatalog,
      data: pokemons,
    };
  }
}
