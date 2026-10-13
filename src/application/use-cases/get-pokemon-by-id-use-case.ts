import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { Pokemon } from '@domain/entities/pokemon';
import { NotFoundError } from '@domain/errors/not-found-error';

export class GetPokemonByIdUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Pokemon> {
    const pokemon = await this.repository.findById(id);

    if (!pokemon) {
      throw new NotFoundError('Pokémon não encontrado na base de dados.');
    }

    return pokemon;
  }
}
