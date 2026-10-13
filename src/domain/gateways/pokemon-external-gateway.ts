export interface ExternalPokemonDetails {
  readonly pokedexNumber: number;
  readonly name: string;
  readonly speciesName: string;
  readonly types: readonly string[];
  readonly hp: number;
  readonly attack: number;
  readonly defense: number;
  readonly spriteUrl: string | null;
  readonly baseExperience: number | null;
  readonly height: number;
  readonly weight: number;
}

export interface ExternalSpeciesDetails {
  readonly isLegendary: boolean;
  readonly isMythical: boolean;
  readonly captureRate: number;
}

export interface PokemonExternalGateway {
  findByName(name: string): Promise<ExternalPokemonDetails | null>;
  findSpeciesByName(name: string): Promise<ExternalSpeciesDetails | null>;
}
