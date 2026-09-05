import { PokemonType } from "../../domain/entities/pokemon-type";
import { PokemonRarity } from "../../domain/entities/pokemon-rarity";

export interface CreatePokemonDTO {
    id: string;
    name: string;
    type: PokemonType;
    rarity: PokemonRarity;
    hp: number;
    attack: number;
    defense: number;
    nickname?: string;
}