import { Prisma } from '@prisma/client';
import { AppError } from '@domain/errors/app-error';
import { ConflictError } from '@domain/errors/conflict-error';
import { NotFoundError } from '@domain/errors/not-found-error';
import { ValidationError } from '@domain/errors/validation-error';

const PRISMA_ERROR = {
  UNIQUE_VIOLATION: 'P2002',
  FOREIGN_KEY_VIOLATION: 'P2003',
  RECORD_NOT_FOUND: 'P2025',
} as const;

const NOT_FOUND_MESSAGES: Record<string, string> = {
  Trainer: 'Treinador não encontrado no banco de dados',
  Pokemon: 'Pokémon não encontrado no banco de dados',
};

export class PrismaErrorMapper {
  static toAppError(
    error: Prisma.PrismaClientKnownRequestError,
  ): AppError | null {
    switch (error.code) {
      case PRISMA_ERROR.UNIQUE_VIOLATION:
        return new ConflictError(
          `Já existe um registro cadastrado com este ${this.describeTarget(error.meta?.target)}`,
        );
      case PRISMA_ERROR.FOREIGN_KEY_VIOLATION:
        return new ValidationError(
          'Relacionamento inválido. O recurso associado não existe',
        );
      case PRISMA_ERROR.RECORD_NOT_FOUND:
        return new NotFoundError(
          this.describeMissingRecord(error.meta?.modelName),
        );
      default:
        return null;
    }
  }

  private static describeTarget(target: unknown): string {
    if (Array.isArray(target) && target.length > 0) {
      return target.join(', ');
    }

    return 'valor';
  }

  private static describeMissingRecord(modelName: unknown): string {
    const message =
      typeof modelName === 'string' ? NOT_FOUND_MESSAGES[modelName] : undefined;

    return message ?? 'Registro não encontrado no banco de dados';
  }
}
