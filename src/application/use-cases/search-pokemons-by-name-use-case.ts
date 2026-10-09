import { Pokemon } from '@domain/entities/pokemon';
import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { DomainError } from '@domain/errors/domain-error';
import { ErrorCode } from '@domain/errors/error-code';

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
      throw new DomainError(
        'O parâmetro name é obrigatório para a busca.',
        ErrorCode.INVALID_ATTRIBUTES,
      );
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
