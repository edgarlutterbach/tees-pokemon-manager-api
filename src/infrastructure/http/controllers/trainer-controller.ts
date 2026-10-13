import { Request, Response } from 'express';
import { CreateTrainerUseCase } from '@application/use-cases/create-trainer-use-case';
import { DeleteTrainerUseCase } from '@application/use-cases/delete-trainer-use-case';
import { ListTrainerTeamUseCase } from '@application/use-cases/list-trainer-team-use-case';
import { CreateTrainerDTO } from '@application/dtos/create-trainer-dto';

export class TrainerController {
  private createUseCase: CreateTrainerUseCase;
  private deleteUseCase: DeleteTrainerUseCase;
  private listTeamUseCase: ListTrainerTeamUseCase;

  constructor(
    createUseCase: CreateTrainerUseCase,
    deleteUseCase: DeleteTrainerUseCase,
    listTeamUseCase: ListTrainerTeamUseCase,
  ) {
    this.createUseCase = createUseCase;
    this.deleteUseCase = deleteUseCase;
    this.listTeamUseCase = listTeamUseCase;
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
}
