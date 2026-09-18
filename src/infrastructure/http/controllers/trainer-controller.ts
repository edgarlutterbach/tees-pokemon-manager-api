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

  async create(req: Request<Record<string, never>, unknown, CreateTrainerDTO>, res: Response): Promise<Response> {
    const { name, age, city } = req.body;

    if (!name || !city || age === undefined) {
      throw new DomainError('Campos obrigatórios ausentes: name, age e city são necessários.', ErrorCode.INVALID_ATTRIBUTES);
    }
    
    const trainer = await this.createUseCase.execute({ name, age, city });

    return res.status(201).json({
      message: 'Treinador cadastrado com sucesso!',
      data: trainer
    });
  }
}
