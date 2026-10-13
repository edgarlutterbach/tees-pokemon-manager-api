import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { Pokemon } from '@domain/entities/pokemon';
import { NotFoundError } from '@domain/errors/not-found-error';
import { ValidationError } from '@domain/errors/validation-error';

export class UpdatePokemonLevelUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(id: string, newLevel: number): Promise<Pokemon> {
    if (newLevel === undefined || newLevel === null) {
      throw new ValidationError('O campo level é obrigatório.');
    }

    const existingPokemon = await this.repository.findById(id);

    if (!existingPokemon) {
      throw new NotFoundError('Pokémon não encontrado no catálogo.');
    }

    const updatedPokemon = existingPokemon.withLevel(newLevel);

    await this.repository.updateLevel(id, updatedPokemon.level);

    return updatedPokemon;
  }
}
