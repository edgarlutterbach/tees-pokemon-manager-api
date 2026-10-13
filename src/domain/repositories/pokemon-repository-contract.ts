import { Pokemon } from '@domain/entities/pokemon';
import { PokemonType } from '@domain/entities/pokemon-type';

export interface PokemonFilters {
  type?: PokemonType;
  minLevel?: number;
  maxLevel?: number;
}

export interface PokemonRepositoryContract {
  create(pokemon: Pokemon): Promise<void>;
  findAll(): Promise<Pokemon[]>;
  findById(id: string): Promise<Pokemon | null>;
  findByFilters(filters: PokemonFilters): Promise<Pokemon[]>;
  update(pokemon: Pokemon): Promise<void>;
  delete(id: string): Promise<void>;
  updateLevel(id: string, newLevel: number): Promise<void>;
  searchByName(term: string): Promise<Pokemon[]>;
  count(): Promise<number>;
  countByTrainerId(trainerId: string): Promise<number>;
}
