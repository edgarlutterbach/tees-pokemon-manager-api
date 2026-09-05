import { pokemonRepository } from "./repositories";
import { ListPokemonsUseCase } from "../../application/use-cases/list-pokemons-use-case";
import { PokemonController } from "../../infrastructure/http/controllers/pokemon-controller";
import { GetPokemonByIdUseCase } from "../../application/use-cases/get-pokemon-by-id-use-case";
import { CreatePokemonUseCase } from "../../application/use-cases/create-pokemon-use-case";

export function makePokemonController(): PokemonController {
    const listUseCase = new ListPokemonsUseCase(pokemonRepository);
    const getByIdUseCase = new GetPokemonByIdUseCase(pokemonRepository); 
    const createUseCase = new CreatePokemonUseCase(pokemonRepository);

    const controller = new PokemonController(
        listUseCase, 
        getByIdUseCase, 
        createUseCase
    );

    return controller;
}