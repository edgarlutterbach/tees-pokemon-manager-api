import { Request, Response } from 'express';
import { CreateTrainerUseCase } from '@application/use-cases/create-trainer-use-case';
import { DeleteTrainerUseCase } from '@application/use-cases/delete-trainer-use-case';
import { ListTrainerTeamUseCase } from '@application/use-cases/list-trainer-team-use-case';
import { CapturePokemonUseCase } from '@application/use-cases/capture-pokemon-use-case';
import { UpdateTrainerRoleUseCase } from '@application/use-cases/update-trainer-role-use-case';
import { UnauthorizedError } from '@domain/errors/unauthorized-error';
import {
  CapturePokemonInput,
  UpdateTrainerRoleInput,
} from '@infrastructure/http/schemas/trainer-schemas';
import { CreateTrainerDTO } from '@application/dtos/create-trainer-dto';

export class TrainerController {
  private createUseCase: CreateTrainerUseCase;
  private deleteUseCase: DeleteTrainerUseCase;
  private listTeamUseCase: ListTrainerTeamUseCase;
  private captureUseCase: CapturePokemonUseCase;
  private updateRoleUseCase: UpdateTrainerRoleUseCase;

  constructor(
    createUseCase: CreateTrainerUseCase,
    deleteUseCase: DeleteTrainerUseCase,
    listTeamUseCase: ListTrainerTeamUseCase,
    captureUseCase: CapturePokemonUseCase,
    updateRoleUseCase: UpdateTrainerRoleUseCase,
  ) {
    this.createUseCase = createUseCase;
    this.deleteUseCase = deleteUseCase;
    this.listTeamUseCase = listTeamUseCase;
    this.captureUseCase = captureUseCase;
    this.updateRoleUseCase = updateRoleUseCase;
  }

  async create(
    req: Request<Request['params'], unknown, CreateTrainerDTO>,
    res: Response,
  ): Promise<Response> {
    const trainer = await this.createUseCase.execute(req.body);

    return res.status(201).json({
      message: 'Treinador cadastrado com sucesso!',
      data: trainer,
    });
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = String(req.params.id);
    await this.deleteUseCase.execute(id);

    return res.status(204).send();
  }

  async team(req: Request, res: Response): Promise<Response> {
    const trainerId = String(req.params.trainerId);
    const result = await this.listTeamUseCase.execute(trainerId);

    return res.status(200).json(result);
  }

  async capture(req: Request, res: Response): Promise<Response> {
    const trainerId = String(req.params.trainerId);
    const body = req.body as CapturePokemonInput;

    const pokemon = await this.captureUseCase.execute({ trainerId, ...body });

    return res.status(201).json({
      message: 'Pokémon capturado com sucesso!',
      data: pokemon,
    });
  }

  async updateRole(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      throw new UnauthorizedError('Usuário não autenticado');
    }

    const trainerId = String(req.params.id);
    const { role } = req.body as UpdateTrainerRoleInput;

    const trainer = await this.updateRoleUseCase.execute({
      trainerId,
      role,
      requesterId: req.user.id,
    });

    return res.status(200).json({
      message: 'Papel do treinador atualizado com sucesso!',
      data: trainer,
    });
  }
}
