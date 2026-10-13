import { Trainer as TrainerModel } from '@prisma/client';
import { Trainer } from '@domain/entities/trainer';
import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';
import { prisma } from './client';

export class PrismaTrainerRepository implements TrainerRepositoryContract {
  async create(trainer: Trainer): Promise<void> {
    await prisma.trainer.create({
      data: {
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        age: trainer.age,
        city: trainer.city,
      },
    });
  }

  async update(trainer: Trainer): Promise<void> {
    await prisma.trainer.update({
      where: { id: trainer.id },
      data: {
        name: trainer.name,
        email: trainer.email,
        age: trainer.age,
        city: trainer.city,
      },
    });
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
