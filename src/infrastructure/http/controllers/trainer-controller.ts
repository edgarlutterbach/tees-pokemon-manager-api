import { Request, Response } from 'express';
import { CreateTrainerUseCase } from '@application/use-cases/create-trainer-use-case';
import { CreateTrainerDTO } from '@application/dtos/create-trainer-dto';

export class TrainerController {
  private createUseCase: CreateTrainerUseCase;

  constructor(createUseCase: CreateTrainerUseCase) {
    this.createUseCase = createUseCase;
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
}
