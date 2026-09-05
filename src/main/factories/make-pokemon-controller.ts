import { pokemonRepository } from "./repositories";
import { ListPokemonsUseCase } from "../../application/use-cases/list-pokemons-use-case";
import { PokemonController } from "../../infrastructure/http/controllers/pokemon-controller";
import { GetPokemonByIdUseCase } from "../../application/use-cases/get-pokemon-by-id-use-case";

export function makePokemonController(): PokemonController {
    const listUseCase = new ListPokemonsUseCase(pokemonRepository);
    const getByIdUseCase = new GetPokemonByIdUseCase(pokemonRepository); 

    const controller = new PokemonController(listUseCase, getByIdUseCase);

    return controller;
}