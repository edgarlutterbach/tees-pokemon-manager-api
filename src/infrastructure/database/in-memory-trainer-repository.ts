import { Trainer } from '@domain/entities/trainer';
import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';
import { NotFoundError } from '@domain/errors/not-found-error';

export class InMemoryTrainerRepository implements TrainerRepositoryContract {
  private trainers: Trainer[] = [];

  async create(trainer: Trainer): Promise<void> {
    this.trainers.push(trainer);
  }

  async update(trainer: Trainer): Promise<void> {
    const index = this.trainers.findIndex((t) => t.id === trainer.id);

    if (index !== -1) {
      this.trainers[index] = trainer;
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.trainers.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new NotFoundError('Treinador não encontrado no banco de dados');
    }

    this.trainers.splice(index, 1);
  }

  async findById(id: string): Promise<Trainer | null> {
    return this.trainers.find((t) => t.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.trainers.find((t) => t.email === normalizedEmail) ?? null;
  }
}
