import { InMemoryPokemonRepository } from '../../infrastructure/database/in-memory-pokemon-repository';
import { Pokemon } from '../../domain/entities/pokemon';
import { PokemonType } from '../../domain/entities/pokemon-type';
import { PokemonRarity } from '../../domain/entities/pokemon-rarity';

const pokemonRepository = new InMemoryPokemonRepository();

pokemonRepository.seed([
    new Pokemon({ id: '1', name: 'Bulbasaur', type: PokemonType.GRASS, rarity: PokemonRarity.COMMON, hp: 45, attack: 49, defense: 55 }),
    new Pokemon({ id: '4', name: 'Charmander', type: PokemonType.FIRE, rarity: PokemonRarity.COMMON, hp: 39, attack: 53, defense: 52 }),
    new Pokemon({ id: '7', name: 'Squirtle', type: PokemonType.WATER, rarity: PokemonRarity.COMMON, hp: 44, attack: 45, defense: 59 }),
    new Pokemon({ id: '5', name: 'Charmeleon', type: PokemonType.FIRE, rarity: PokemonRarity.COMMON, hp: 96, attack: 90, defense: 88 }),
    new Pokemon({ id: '50', name: 'Lugia', type: PokemonType.PSYCHIC, rarity: PokemonRarity.LEGENDARY, nickname: 'First one', hp: 203, attack: 159, defense: 103 }),
]);

export { pokemonRepository };