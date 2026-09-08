import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { CreatePokemonDTO } from '@application/dtos/create-pokemon-dto';
import { Pokemon } from '@domain/entities/pokemon';
import { DuplicateResourceError } from '@domain/errors/duplicate-resource-error';

export class CreatePokemonUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const pokemonExistente = await this.repository.findById(data.id);

    if (pokemonExistente) {
      throw new DuplicateResourceError(
        'Pokémon com este ID já está cadastrado.',
      );
    }

    const novoPokemon = new Pokemon(data);

    await this.repository.create(novoPokemon);

    return novoPokemon;
  }
}
