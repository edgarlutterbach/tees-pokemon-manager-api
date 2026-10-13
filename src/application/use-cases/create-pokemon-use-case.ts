import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { CreatePokemonDTO } from '@application/dtos/create-pokemon-dto';
import { Pokemon } from '@domain/entities/pokemon';
import { Trainer } from '@domain/entities/trainer';
import { ConflictError } from '@domain/errors/conflict-error';

export class CreatePokemonUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const pokemonExistente = await this.repository.findById(data.id);

    if (pokemonExistente) {
      throw new ConflictError('Já existe um Pokémon cadastrado com este ID.');
    }

    const novoPokemon = new Pokemon(data);

    if (novoPokemon.trainerId) {
      await this.ensureTeamHasRoom(novoPokemon.trainerId);
    }

    await this.repository.create(novoPokemon);

    return novoPokemon;
  }

  private async ensureTeamHasRoom(trainerId: string): Promise<void> {
    const teamSize = await this.repository.countByTrainerId(trainerId);

    if (teamSize >= Trainer.MAX_TEAM_SIZE) {
      throw new ConflictError(
        `O treinador já possui o limite máximo de ${Trainer.MAX_TEAM_SIZE} Pokémons em seu time`,
      );
    }
  }
}
