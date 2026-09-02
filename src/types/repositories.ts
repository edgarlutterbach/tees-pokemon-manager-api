import { Pokemon } from '../main/server';

interface PokemonRepositoryContract {
    save(pokemon: Pokemon): Promise<void>;
    findAll(): Promise<Pokemon[]>;
    findById(id: string): Promise<Pokemon | null>;
}

class MockPokemonRepository implements PokemonRepositoryContract {
    private pokemons: Pokemon[] = [];

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
}