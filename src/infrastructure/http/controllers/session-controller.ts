import { Request, Response } from 'express';
import { AuthenticateTrainerUseCase } from '@application/use-cases/authenticate-trainer-use-case';
import { AuthenticateTrainerDTO } from '@application/dtos/authenticate-trainer-dto';

export class SessionController {
  private authenticateUseCase: AuthenticateTrainerUseCase;

  constructor(authenticateUseCase: AuthenticateTrainerUseCase) {
    this.authenticateUseCase = authenticateUseCase;
  }

  async create(
    req: Request<Request['params'], unknown, AuthenticateTrainerDTO>,
    res: Response,
  ): Promise<Response> {
    const { trainer, token } = await this.authenticateUseCase.execute(req.body);

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      data: { trainer, token },
    });
  }
}
