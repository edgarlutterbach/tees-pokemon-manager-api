import { Pokemon } from '@domain/entities/pokemon';
import {
  Pagination,
  PokemonFilters,
  PokemonRepositoryContract,
} from '@domain/repositories/pokemon-repository-contract';

export type ListPokemonsInput = PokemonFilters & Pagination;

export interface ListPokemonsResult {
  data: Pokemon[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export class ListPokemonsUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute({
    page,
    limit,
    ...filters
  }: ListPokemonsInput): Promise<ListPokemonsResult> {
    const { items, total } = await this.repository.findByFilters(filters, {
      page,
      limit,
    });

    return {
      data: items,
      meta: { page, limit, total },
    };
  }
}
