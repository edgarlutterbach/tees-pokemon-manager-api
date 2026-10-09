import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { Pokemon } from '@domain/entities/pokemon';
import { ResourceNotFoundError } from '@domain/errors/resource-not-found-error';
import { InvalidPokemonAttributesError } from '@domain/errors/invalid-pokemon-attributes-error';

export class UpdatePokemonLevelUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(id: string, newLevel: number): Promise<Pokemon> {
    if (newLevel === undefined || newLevel === null) {
      throw new InvalidPokemonAttributesError('O campo level é obrigatório.');
    }

    const existingPokemon = await this.repository.findById(id);

    if (!existingPokemon) {
      throw new ResourceNotFoundError('Pokémon não encontrado no catálogo.');
    }

    const updatedPokemon = existingPokemon.withLevel(newLevel);

    await this.repository.updateLevel(id, updatedPokemon.level);

    return updatedPokemon;
  }
}
