import { Request, Response } from 'express';
import { ListPokemonsUseCase } from '../../../application/use-cases/list-pokemons-use-case';
import { GetPokemonByIdUseCase } from '../../../application/use-cases/get-pokemon-by-id-use-case';
import { DomainError } from '../../../domain/errors/domain-error';
import { ErrorCode } from '../../../domain/errors/error-code';

export class PokemonController {
    private listUseCase: ListPokemonsUseCase;
    private getByIdUseCase: GetPokemonByIdUseCase;

    constructor(
        listUseCase: ListPokemonsUseCase, 
        getByIdUseCase: GetPokemonByIdUseCase
    ) {
        this.listUseCase = listUseCase;
        this.getByIdUseCase = getByIdUseCase;

    }

    async list(req: Request, res: Response): Promise<Response> {
        const type = req.query.type as string | undefined;

        const pokemons = await this.listUseCase.execute(type);

        return res.status(200).json(pokemons)
    }

    async getById(req: Request, res: Response): Promise<Response> {
        const id = String(req.params.id);

        try {
            const pokemon = await this.getByIdUseCase.execute(id);
            return res.status(200).json(pokemon);
        } catch (error) {
            if(error instanceof DomainError && error.code === ErrorCode.RESOURCE_NOT_FOUND) {
                return res.status(404).json({ error: error.message});
            }

            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }
}