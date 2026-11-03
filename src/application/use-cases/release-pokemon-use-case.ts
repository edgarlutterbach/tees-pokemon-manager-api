import { Pokemon } from '@domain/entities/pokemon';
import { TrainerRole } from '@domain/entities/trainer-role';
import { ConflictError } from '@domain/errors/conflict-error';
import { ForbiddenError } from '@domain/errors/forbidden-error';
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { ReleasePokemonDTO } from '@application/dtos/release-pokemon-dto';

export class ReleasePokemonUseCase {
  private repository: PokemonRepositoryContract;

  constructor(repository: PokemonRepositoryContract) {
    this.repository = repository;
  }

  async execute({
    pokemonId,
    currentUserId,
    currentUserRole,
  }: ReleasePokemonDTO): Promise<Pokemon> {
    const pokemon = await this.repository.findById(pokemonId);

    if (!pokemon) {
      throw new NotFoundError('Pokémon não encontrado no catálogo.');
    }

    const isAdmin = currentUserRole === TrainerRole.ADMIN;

    if (!isAdmin && pokemon.trainerId !== currentUserId) {
      throw new ForbiddenError(
        'Você não tem permissão para alterar Pokémons de outro treinador',
      );
    }

    if (!pokemon.trainerId) {
      throw new ConflictError('O Pokémon já está livre, sem treinador');
    }

    const releasedPokemon = pokemon.release();

    await this.repository.releaseFromTrainer(pokemon.id);

    return releasedPokemon;
  }
}
