import { Pokemon } from '@domain/entities/pokemon';
import { Trainer } from '@domain/entities/trainer';
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';

export interface TrainerTeamResult {
  data: Pokemon[];
  meta: {
    trainerId: string;
    total: number;
    maxSize: number;
  };
}

export class ListTrainerTeamUseCase {
  private trainerRepository: TrainerRepositoryContract;
  private pokemonRepository: PokemonRepositoryContract;

  constructor(
    trainerRepository: TrainerRepositoryContract,
    pokemonRepository: PokemonRepositoryContract,
  ) {
    this.trainerRepository = trainerRepository;
    this.pokemonRepository = pokemonRepository;
  }

  async execute(trainerId: string): Promise<TrainerTeamResult> {
    const trainer = await this.trainerRepository.findById(trainerId);

    if (!trainer) {
      throw new NotFoundError('Treinador não encontrado no banco de dados');
    }

    const team = await this.pokemonRepository.findByTrainerId(trainerId);

    return {
      data: team,
      meta: {
        trainerId,
        total: team.length,
        maxSize: Trainer.MAX_TEAM_SIZE,
      },
    };
  }
}
