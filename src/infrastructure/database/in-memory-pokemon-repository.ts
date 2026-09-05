import { Pokemon } from '../../domain/entities/pokemon';
import { PokemonRepositoryContract } from '../../domain/repositories/pokemon-repository-contract';

export class InMemoryPokemonRepository implements PokemonRepositoryContract {
    private pokemons: Pokemon[] = [];

    seed(pokemons: Pokemon[]): void {
        this.pokemons = pokemons;
    }

    async save(pokemon: Pokemon): Promise<void> {
        this.pokemons.push(pokemon);
    }

    async findAll(): Promise<Pokemon[]> {
        return this.pokemons;
    }

    async findById(id: string): Promise<Pokemon | null> {
        const pokemon = this.pokemons.find((p) => p.id === id);
        return pokemon ?? null;
    }

    async findByType(type: string): Promise<Pokemon[]> {
        return this.pokemons.filter(
            (p) => p.type.toLowerCase() === type.toLowerCase()
        );
    }
}