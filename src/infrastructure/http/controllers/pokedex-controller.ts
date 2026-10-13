import { Request, Response } from 'express';
import { SearchPokedexUseCase } from '@application/use-cases/search-pokedex-use-case';
import { PokedexSearchQuery } from '@infrastructure/http/schemas/pokedex-schemas';

export class PokedexController {
  private searchUseCase: SearchPokedexUseCase;

  constructor(searchUseCase: SearchPokedexUseCase) {
    this.searchUseCase = searchUseCase;
  }

  async search(req: Request, res: Response): Promise<Response> {
    const { name } = req.query as unknown as PokedexSearchQuery;
    const entry = await this.searchUseCase.execute(name);

    return res.status(200).json(entry);
  }
}
