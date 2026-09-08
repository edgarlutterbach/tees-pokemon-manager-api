import { Request, Response } from 'express';
import { ListPokemonsUseCase } from '../../../application/use-cases/list-pokemons-use-case';
import { GetPokemonByIdUseCase } from '../../../application/use-cases/get-pokemon-by-id-use-case';
import { CreatePokemonUseCase } from '../../../application/use-cases/create-pokemon-use-case';
import { UpdatePokemonUseCase } from '../../../application/use-cases/update-pokemon-use-case';
import { DeletePokemonUseCase } from '../../../application/use-cases/delete-pokemon-use-case';
import { GetPokemonStatsUseCase } from '../../../application/use-cases/get-pokemon-stats-use-case';
import { DomainError } from '../../../domain/errors/domain-error';
import { ErrorCode } from '../../../domain/errors/error-code';

export class PokemonController {
  private listUseCase: ListPokemonsUseCase;
  private getByIdUseCase: GetPokemonByIdUseCase;
  private createUseCase: CreatePokemonUseCase;
  private updateUseCase: UpdatePokemonUseCase;
  private deleteUseCase: DeletePokemonUseCase;
  private statsUseCase: GetPokemonStatsUseCase;

  constructor(
    listUseCase: ListPokemonsUseCase,
    getByIdUseCase: GetPokemonByIdUseCase,
    createUseCase: CreatePokemonUseCase,
    updateUseCase: UpdatePokemonUseCase,
    deleteUseCase: DeletePokemonUseCase,
    statsUseCase: GetPokemonStatsUseCase,
  ) {
    this.listUseCase = listUseCase;
    this.getByIdUseCase = getByIdUseCase;
    this.createUseCase = createUseCase;
    this.updateUseCase = updateUseCase;
    this.deleteUseCase = deleteUseCase;
    this.statsUseCase = statsUseCase;
  }

  async list(req: Request, res: Response): Promise<Response> {
    const type = req.query.type as string | undefined;

    const pokemons = await this.listUseCase.execute(type);

    return res.status(200).json(pokemons);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);

    try {
      const pokemon = await this.getByIdUseCase.execute(id);
      return res.status(200).json(pokemon);
    } catch (error) {
      if (
        error instanceof DomainError &&
        error.code === ErrorCode.RESOURCE_NOT_FOUND
      ) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const pokemon = await this.createUseCase.execute(req.body);

      return res.status(201).json({
        message: 'Pokémon cadastrado com sucesso!',
        data: pokemon,
      });
    } catch (error) {
      if (
        error instanceof DomainError &&
        (error.code === ErrorCode.DUPLICATE_RESOURCE ||
          error.code === ErrorCode.INVALID_ATTRIBUTES)
      ) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);

    try {
      const pokemon = await this.updateUseCase.execute(id, req.body);

      return res.status(200).json({
        message: 'Pokémon editado com sucesso!',
        data: pokemon,
      });
    } catch (error) {
      if (
        error instanceof DomainError &&
        error.code === ErrorCode.RESOURCE_NOT_FOUND
      ) {
        return res.status(404).json({ error: error.message });
      }

      if (
        error instanceof DomainError &&
        error.code === ErrorCode.INVALID_ATTRIBUTES
      ) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);

    try {
      await this.deleteUseCase.execute(id);
      return res.status(204).send();
    } catch (error) {
      if (
        error instanceof DomainError &&
        error.code === ErrorCode.RESOURCE_NOT_FOUND
      ) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  }

  async stats(req: Request, res: Response): Promise<Response> {
    const stats = await this.statsUseCase.execute();
    return res.status(200).json(stats);
  }
}
