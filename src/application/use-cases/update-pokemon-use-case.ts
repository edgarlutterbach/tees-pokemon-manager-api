import { PokemonRepositoryContract } from '../../domain/repositories/pokemon-repository-contract';
import { Pokemon } from '../../domain/entities/pokemon';
import { UpdatePokemonDTO } from '../dtos/update-pokemon-dto';
import { ResourceNotFoundError } from '../../domain/errors/resource-not-found-error';

export class UpdatePokemonUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute(id: string, data: UpdatePokemonDTO): Promise<Pokemon> {
    const existingPokemon = await this.repository.findById(id);

    if (!existingPokemon) {
      throw new ResourceNotFoundError('Pokémon não encontrado no catálogo.');
    }

    const updatedPokemon = new Pokemon({
      id: existingPokemon.id,
      name: data.name ?? existingPokemon.name,
      type: data.type ?? existingPokemon.type,
      rarity: data.rarity ?? existingPokemon.rarity,
      hp: data.hp ?? existingPokemon.hp,
      attack: data.attack ?? existingPokemon.attack,
      defense: data.defense ?? existingPokemon.defense,
      nickname: data.nickname ?? existingPokemon.nickname,
    });

    await this.repository.update(updatedPokemon);

    return updatedPokemon;
  }
}
