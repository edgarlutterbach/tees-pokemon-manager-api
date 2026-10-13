import {
  ExternalPokemonDetails,
  PokemonExternalGateway,
} from '@domain/gateways/pokemon-external-gateway';

const ARTWORK_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

const CATALOG: ReadonlyMap<string, ExternalPokemonDetails> = new Map([
  [
    'bulbasaur',
    {
      pokedexNumber: 1,
      name: 'bulbasaur',
      types: ['GRASS', 'POISON'],
      hp: 45,
      attack: 49,
      defense: 49,
      spriteUrl: `${ARTWORK_URL}/1.png`,
      baseExperience: 64,
      height: 7,
      weight: 69,
    },
  ],
  [
    'charmander',
    {
      pokedexNumber: 4,
      name: 'charmander',
      types: ['FIRE'],
      hp: 39,
      attack: 52,
      defense: 43,
      spriteUrl: `${ARTWORK_URL}/4.png`,
      baseExperience: 62,
      height: 6,
      weight: 85,
    },
  ],
  [
    'pikachu',
    {
      pokedexNumber: 25,
      name: 'pikachu',
      types: ['ELECTRIC'],
      hp: 35,
      attack: 55,
      defense: 40,
      spriteUrl: `${ARTWORK_URL}/25.png`,
      baseExperience: 112,
      height: 4,
      weight: 60,
    },
  ],
  [
    'raichu',
    {
      pokedexNumber: 26,
      name: 'raichu',
      types: ['ELECTRIC'],
      hp: 60,
      attack: 90,
      defense: 55,
      spriteUrl: `${ARTWORK_URL}/26.png`,
      baseExperience: 243,
      height: 8,
      weight: 300,
    },
  ],
]);

export class InMemoryPokemonGateway implements PokemonExternalGateway {
  async findByName(name: string): Promise<ExternalPokemonDetails | null> {
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
    const details = CATALOG.get(slug);

    return details ? { ...details, types: [...details.types] } : null;
  }
}
