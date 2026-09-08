import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { ResourceNotFoundError } from '@domain/errors/resource-not-found-error';

export class DeletePokemonUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    const existingPokemon = await this.repository.findById(id);

    if (!existingPokemon) {
      throw new ResourceNotFoundError('Pokémon não encontrado no catálogo.');
    }

    await this.repository.delete(id);
  }
}
