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
      spriteUrl: `${ARTWORK_URL}/1.png`,
      baseExperience: 64,
      height: 7,
      weight: 69,
    },
  ],
  [
    'charmander',
    {
      spriteUrl: `${ARTWORK_URL}/4.png`,
      baseExperience: 62,
      height: 6,
      weight: 85,
    },
  ],
  [
    'pikachu',
    {
      spriteUrl: `${ARTWORK_URL}/25.png`,
      baseExperience: 112,
      height: 4,
      weight: 60,
    },
  ],
  [
    'raichu',
    {
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

    return details ? { ...details } : null;
  }
}
