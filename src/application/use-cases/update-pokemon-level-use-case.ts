import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { Pokemon } from '@domain/entities/pokemon';
import { NotFoundError } from '@domain/errors/not-found-error';

export class UpdatePokemonLevelUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(id: string, newLevel: number): Promise<Pokemon> {
    const existingPokemon = await this.repository.findById(id);

    if (!existingPokemon) {
      throw new NotFoundError('Pokémon não encontrado no catálogo.');
    }

    const updatedPokemon = existingPokemon.withLevel(newLevel);

    await this.repository.updateLevel(id, updatedPokemon.level);

    return updatedPokemon;
  }
}
