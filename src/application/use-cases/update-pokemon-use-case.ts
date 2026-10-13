import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { Pokemon } from '@domain/entities/pokemon';
import { UpdatePokemonDTO } from '../dtos/update-pokemon-dto';
import { NotFoundError } from '@domain/errors/not-found-error';

interface ExternalFields {
  spriteUrl?: string;
  baseExperience?: number;
  height?: number;
  weight?: number;
}

export class UpdatePokemonUseCase {
  private repository: PokemonRepositoryContract;
  private externalGateway: PokemonExternalGateway;

  constructor(
    repository: PokemonRepositoryContract,
    externalGateway: PokemonExternalGateway,
  ) {
    this.repository = repository;
    this.externalGateway = externalGateway;
  }

  async execute(id: string, data: UpdatePokemonDTO): Promise<Pokemon> {
    const existingPokemon = await this.repository.findById(id);

    if (!existingPokemon) {
      throw new NotFoundError('Pokémon não encontrado no catálogo.');
    }

    const name = data.name ?? existingPokemon.name;
    const externalDetails = await this.resolveExternalDetails(
      existingPokemon,
      name,
    );

    const updatedPokemon = new Pokemon({
      id: existingPokemon.id,
      name,
      type: data.type ?? existingPokemon.type,
      rarity: data.rarity ?? existingPokemon.rarity,
      hp: data.hp ?? existingPokemon.hp,
      attack: data.attack ?? existingPokemon.attack,
      defense: data.defense ?? existingPokemon.defense,
      nickname: data.nickname ?? existingPokemon.nickname,
      level: existingPokemon.level,
      trainerId: existingPokemon.trainerId,
      ...externalDetails,
    });

    await this.repository.update(updatedPokemon);

    return updatedPokemon;
  }

  private async resolveExternalDetails(
    existingPokemon: Pokemon,
    newName: string,
  ): Promise<ExternalFields> {
    if (!this.hasNameChanged(existingPokemon.name, newName)) {
      return {
        spriteUrl: existingPokemon.spriteUrl,
        baseExperience: existingPokemon.baseExperience,
        height: existingPokemon.height,
        weight: existingPokemon.weight,
      };
    }

    const details = await this.externalGateway.findByName(newName);

    if (!details) {
      throw new NotFoundError(
        'Pokémon não encontrado na base oficial da PokeAPI',
      );
    }

    return {
      spriteUrl: details.spriteUrl ?? undefined,
      baseExperience: details.baseExperience ?? undefined,
      height: details.height,
      weight: details.weight,
    };
  }

  private hasNameChanged(currentName: string, newName: string): boolean {
    return currentName.trim().toLowerCase() !== newName.trim().toLowerCase();
  }
}
