export interface PokedexEntryDTO {
  pokedexNumber: number;
  name: string;
  types: string[];
  spriteUrl: string | null;
  baseExperience: number | null;
  height: number;
  weight: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
  };
}
