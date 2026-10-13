import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { CreatePokemonDTO } from '@application/dtos/create-pokemon-dto';
import { Pokemon } from '@domain/entities/pokemon';
import { Trainer } from '@domain/entities/trainer';
import { ConflictError } from '@domain/errors/conflict-error';
import { NotFoundError } from '@domain/errors/not-found-error';

export class CreatePokemonUseCase {
  private repository: PokemonRepositoryContract;
  private externalGateway: PokemonExternalGateway;

  constructor(
    repository: PokemonRepositoryContract,
    externalGateway: PokemonExternalGateway,
  ) {
    this.repository = repository;
    this.externalGateway = externalGateway;
  }

  async execute(data: CreatePokemonDTO): Promise<Pokemon> {
    const pokemonExistente = await this.repository.findById(data.id);

    if (pokemonExistente) {
      throw new ConflictError('Já existe um Pokémon cadastrado com este ID.');
    }

    if (data.trainerId) {
      await this.ensureTeamHasRoom(data.trainerId);
    }

    const externalDetails = await this.externalGateway.findByName(data.name);

    if (!externalDetails) {
      throw new NotFoundError(
        'Pokémon não encontrado na base oficial da PokeAPI',
      );
    }

    const novoPokemon = new Pokemon({
      ...data,
      spriteUrl: externalDetails.spriteUrl ?? undefined,
      baseExperience: externalDetails.baseExperience ?? undefined,
      height: externalDetails.height,
      weight: externalDetails.weight,
    });

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
