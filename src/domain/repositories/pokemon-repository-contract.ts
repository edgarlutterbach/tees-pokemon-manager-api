import { Pokemon } from '../entities/pokemon';

export interface PokemonRepositoryContract {
    save(pokemon: Pokemon): Promise<void>;
    findAll(): Promise<Pokemon[]>;
    findById(id: string): Promise<Pokemon | null>;
    findByType(type: string): Promise<Pokemon[]>;
}