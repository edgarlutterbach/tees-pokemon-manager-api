import { Request, Response } from 'express';
import { CreateTrainerUseCase } from '@application/use-cases/create-trainer-use-case';
import { CreateTrainerDTO } from '@application/dtos/create-trainer-dto';
import { DomainError } from '@domain/errors/domain-error';
import { ErrorCode } from '@domain/errors/error-code';

export class TrainerController {
  private createUseCase: CreateTrainerUseCase;

  constructor(createUseCase: CreateTrainerUseCase) {
    this.createUseCase = createUseCase;
  }

  async create(
    req: Request<Record<string, never>, unknown, CreateTrainerDTO>,
    res: Response,
  ): Promise<Response> {
    const { name, email, age, city } = req.body;

    if (!name || !email || !city || age === undefined) {
      throw new DomainError(
        'Campos obrigatórios ausentes: name, email, age e city são necessários.',
        ErrorCode.INVALID_ATTRIBUTES,
      );
    }

    const trainer = await this.createUseCase.execute({
      name,
      email,
      age,
      city,
    });

    return res.status(201).json({
      message: 'Treinador cadastrado com sucesso!',
      data: trainer,
    });
  }
}
