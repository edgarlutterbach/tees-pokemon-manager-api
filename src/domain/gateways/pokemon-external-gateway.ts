export interface ExternalPokemonDetails {
  readonly spriteUrl: string | null;
  readonly baseExperience: number | null;
  readonly height: number;
  readonly weight: number;
}

export interface PokemonExternalGateway {
  findByName(name: string): Promise<ExternalPokemonDetails | null>;
}
