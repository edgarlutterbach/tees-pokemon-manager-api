import { PokemonRepositoryContract } from '../../domain/repositories/pokemon-repository-contract';

interface PokemonStats {
  totalPokemons: number;
  typesCount: Record<string, number>;
}

export class GetPokemonStatsUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(): Promise<PokemonStats> {
    const pokemons = await this.repository.findAll();

    const typesCount = pokemons.reduce(
      (acumulador, pokemon) => {
        acumulador[pokemon.type] = (acumulador[pokemon.type] ?? 0) + 1;
        return acumulador;
      },
      {} as Record<string, number>,
    );

    return {
      totalPokemons: pokemons.length,
      typesCount,
    };
  }
}
