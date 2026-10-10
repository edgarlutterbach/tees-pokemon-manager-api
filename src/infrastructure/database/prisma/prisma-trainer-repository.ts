import { Prisma, Trainer as TrainerModel } from '@prisma/client';
import { Trainer } from '@domain/entities/trainer';
import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';
import { DuplicateResourceError } from '@domain/errors/duplicate-resource-error';
import { prisma } from './client';

const PRISMA_UNIQUE_VIOLATION = 'P2002';

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === PRISMA_UNIQUE_VIOLATION
  );
}

export class PrismaTrainerRepository implements TrainerRepositoryContract {
  async create(trainer: Trainer): Promise<void> {
    await this.executeWrite(() =>
      prisma.trainer.create({
        data: {
          id: trainer.id,
          name: trainer.name,
          email: trainer.email,
          age: trainer.age,
          city: trainer.city,
        },
      }),
    );
  }

  async update(trainer: Trainer): Promise<void> {
    await this.executeWrite(() =>
      prisma.trainer.update({
        where: { id: trainer.id },
        data: {
          name: trainer.name,
          email: trainer.email,
          age: trainer.age,
          city: trainer.city,
        },
      }),
    );
  }

  async findById(id: string): Promise<Trainer | null> {
    const row = await prisma.trainer.findUnique({ where: { id } });

    return row ? this.toEntity(row) : null;
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    const row = await prisma.trainer.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    return row ? this.toEntity(row) : null;
  }

  private async executeWrite(operation: () => Promise<unknown>): Promise<void> {
    try {
      await operation();
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        throw new DuplicateResourceError(
          'Já existe um treinador cadastrado com este e-mail.',
        );
      }
      throw error;
    }
  }

  private toEntity(row: TrainerModel): Trainer {
    return new Trainer({
      id: row.id,
      name: row.name,
      email: row.email,
      age: row.age,
      city: row.city,
    });
  }
}
