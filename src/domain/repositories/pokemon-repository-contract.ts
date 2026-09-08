import { Pokemon } from '../entities/pokemon';

export interface PokemonRepositoryContract {
  create(pokemon: Pokemon): Promise<void>;
  findAll(): Promise<Pokemon[]>;
  findById(id: string): Promise<Pokemon | null>;
  findByType(type: string): Promise<Pokemon[]>;
  update(pokemon: Pokemon): Promise<void>;
  delete(id: string): Promise<void>;
}
