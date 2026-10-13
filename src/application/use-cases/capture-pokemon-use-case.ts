import { randomUUID } from 'node:crypto';
import { Pokemon } from '@domain/entities/pokemon';
import { PokemonType } from '@domain/entities/pokemon-type';
import { Trainer } from '@domain/entities/trainer';
import { ConflictError } from '@domain/errors/conflict-error';
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';
import { classifyPokemonRarity } from '@domain/services/classify-pokemon-rarity';
import { CapturePokemonDTO } from '@application/dtos/capture-pokemon-dto';

const POKEMON_TYPES: readonly string[] = Object.values(PokemonType);

export class CapturePokemonUseCase {
  private trainerRepository: TrainerRepositoryContract;
  private pokemonRepository: PokemonRepositoryContract;
  private externalGateway: PokemonExternalGateway;

  constructor(
    trainerRepository: TrainerRepositoryContract,
    pokemonRepository: PokemonRepositoryContract,
    externalGateway: PokemonExternalGateway,
  ) {
    this.trainerRepository = trainerRepository;
    this.pokemonRepository = pokemonRepository;
    this.externalGateway = externalGateway;
  }

  async execute({
    trainerId,
    name,
    nickname,
  }: CapturePokemonDTO): Promise<Pokemon> {
    const trainer = await this.trainerRepository.findById(trainerId);

    if (!trainer) {
      throw new NotFoundError('Treinador não encontrado no banco de dados');
    }

    await this.ensureTeamHasRoom(trainerId);

    const details = await this.externalGateway.findByName(name);

    if (!details) {
      throw new NotFoundError(
        'Pokémon não encontrado na base oficial da PokeAPI',
      );
    }

    const species = await this.externalGateway.findSpeciesByName(
      details.speciesName,
    );

    if (!species) {
      throw new NotFoundError(
        'Espécie do Pokémon não encontrada na base oficial da PokeAPI',
      );
    }

    const pokemon = new Pokemon({
      id: randomUUID(),
      name: this.formatName(details.name),
      type: this.toPokemonType(details.types[0]),
      rarity: classifyPokemonRarity(species),
      hp: details.hp,
      attack: details.attack,
      defense: details.defense,
      nickname,
      trainerId,
      spriteUrl: details.spriteUrl ?? undefined,
      baseExperience: details.baseExperience ?? undefined,
      height: details.height,
      weight: details.weight,
    });

    await this.pokemonRepository.create(pokemon);

    return pokemon;
  }

  private async ensureTeamHasRoom(trainerId: string): Promise<void> {
    const teamSize = await this.pokemonRepository.countByTrainerId(trainerId);

    if (teamSize >= Trainer.MAX_TEAM_SIZE) {
      throw new ConflictError(
        `O treinador já possui o limite máximo de ${Trainer.MAX_TEAM_SIZE} Pokémons em seu time`,
      );
    }
  }

  private toPokemonType(rawType: string | undefined): PokemonType {
    if (!rawType || !POKEMON_TYPES.includes(rawType)) {
      throw new Error(
        `[Captura]: tipo "${rawType}" retornado pela PokeAPI não é suportado`,
      );
    }

    return rawType as PokemonType;
  }

  private formatName(name: string): string {
    return name
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('-');
  }
}
