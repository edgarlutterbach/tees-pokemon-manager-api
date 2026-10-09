import { Request, Response } from 'express';
import { ListPokemonsUseCase } from '@application/use-cases/list-pokemons-use-case';
import { GetPokemonByIdUseCase } from '@application/use-cases/get-pokemon-by-id-use-case';
import { CreatePokemonUseCase } from '@application/use-cases/create-pokemon-use-case';
import { UpdatePokemonUseCase } from '@application/use-cases/update-pokemon-use-case';
import { DeletePokemonUseCase } from '@application/use-cases/delete-pokemon-use-case';
import { GetPokemonStatsUseCase } from '@application/use-cases/get-pokemon-stats-use-case';
import { UpdatePokemonLevelUseCase } from '@application/use-cases/update-pokemon-level-use-case';

export class PokemonController {
  private listUseCase: ListPokemonsUseCase;
  private getByIdUseCase: GetPokemonByIdUseCase;
  private createUseCase: CreatePokemonUseCase;
  private updateUseCase: UpdatePokemonUseCase;
  private deleteUseCase: DeletePokemonUseCase;
  private statsUseCase: GetPokemonStatsUseCase;
  private updateLevelUseCase: UpdatePokemonLevelUseCase;

  constructor(
    listUseCase: ListPokemonsUseCase,
    getByIdUseCase: GetPokemonByIdUseCase,
    createUseCase: CreatePokemonUseCase,
    updateUseCase: UpdatePokemonUseCase,
    deleteUseCase: DeletePokemonUseCase,
    statsUseCase: GetPokemonStatsUseCase,
    updateLevelUseCase: UpdatePokemonLevelUseCase,
  ) {
    this.listUseCase = listUseCase;
    this.getByIdUseCase = getByIdUseCase;
    this.createUseCase = createUseCase;
    this.updateUseCase = updateUseCase;
    this.deleteUseCase = deleteUseCase;
    this.statsUseCase = statsUseCase;
    this.updateLevelUseCase = updateLevelUseCase;
  }

  async list(req: Request, res: Response): Promise<Response> {
    const type = req.query.type as string | undefined;

    const pokemons = await this.listUseCase.execute(type);

    return res.status(200).json(pokemons);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    const pokemon = await this.getByIdUseCase.execute(id);

    return res.status(200).json(pokemon);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const pokemon = await this.createUseCase.execute(req.body);

    return res.status(201).json({
      message: 'Pokémon cadastrado com sucesso!',
      data: pokemon,
    });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    const pokemon = await this.updateUseCase.execute(id, req.body);

    return res.status(200).json({
      message: 'Pokémon editado com sucesso!',
      data: pokemon,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    await this.deleteUseCase.execute(id);

    return res.status(204).send();
  }

  async stats(req: Request, res: Response): Promise<Response> {
    const stats = await this.statsUseCase.execute();
    return res.status(200).json(stats);
  }

  async updateLevel(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    const level = req.body?.level;

    const pokemon = await this.updateLevelUseCase.execute(id, level);

    return res.status(200).json({
      message: 'Nível do Pokémon atualizado com sucesso!',
      data: pokemon,
    });
  }
}
