import { Pokemon } from "../../domain/entities/pokemon";
import { PokemonRepositoryContract } from "../../domain/repositories/pokemon-repository-contract";

export class ListPokemonsUseCase {
    private repository: PokemonRepositoryContract;

    constructor(repository: PokemonRepositoryContract) {
        this.repository = repository;
    }

    execute(type?: string): Promise<Pokemon[]> {
        if(type) {
            return this.repository.findByType(type);
        }

        return this.repository.findAll();
    }
}