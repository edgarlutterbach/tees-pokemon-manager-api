import { Pokemon } from '@domain/entities/pokemon';
import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';

export class InMemoryPokemonRepository implements PokemonRepositoryContract {
  private pokemons: Pokemon[] = [];

  seed(pokemons: Pokemon[]): void {
    this.pokemons = pokemons;
  }

  async create(pokemon: Pokemon): Promise<void> {
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
      (p) => p.type.toLowerCase() === type.toLowerCase(),
    );
  }

  async update(pokemon: Pokemon): Promise<void> {
    const index = this.pokemons.findIndex((p) => p.id === pokemon.id);

    if (index !== -1) {
      this.pokemons[index] = pokemon;
    }
  }

  async delete(id: string): Promise<void> {
    this.pokemons = this.pokemons.filter((p) => p.id !== id);
  }
}
