import { Trainer } from '@domain/entities/trainer';
import { TrainerRepositoryContract } from '@domain/repositories/trainer-repository-contract';
import { DuplicateResourceError } from '@domain/errors/duplicate-resource-error';
import { postgresPool } from './connection';

interface TrainerRow {
  id: string;
  name: string;
  email: string;
  age: number;
  city: string;
}

const PG_UNIQUE_VIOLATION = '23505';
const SELECT_COLUMNS = 'id, name, email, age, city';

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === PG_UNIQUE_VIOLATION
  );
}

export class PgTrainerRepository implements TrainerRepositoryContract {
  async create(trainer: Trainer): Promise<void> {
    const query = `
            INSERT INTO trainers (id, name, email, age, city)
            VALUES ($1, $2, $3, $4, $5)
        `;
    await this.executeWrite(query, [
      trainer.id,
      trainer.name,
      trainer.email,
      trainer.age,
      trainer.city,
    ]);
  }

  async update(trainer: Trainer): Promise<void> {
    const query = `
            UPDATE trainers
            SET name = $2, email = $3, age = $4, city = $5
            WHERE id = $1
        `;
    await this.executeWrite(query, [
      trainer.id,
      trainer.name,
      trainer.email,
      trainer.age,
      trainer.city,
    ]);
  }

  async findById(id: string): Promise<Trainer | null> {
    const query = `SELECT ${SELECT_COLUMNS} FROM trainers WHERE id = $1`;
    const result = await postgresPool.query<TrainerRow>(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.toEntity(result.rows[0]);
  }

  async findByEmail(email: string): Promise<Trainer | null> {
    const query = `SELECT ${SELECT_COLUMNS} FROM trainers WHERE email = $1`;
    const result = await postgresPool.query<TrainerRow>(query, [
      email.trim().toLowerCase(),
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.toEntity(result.rows[0]);
  }

  private async executeWrite(query: string, params: unknown[]): Promise<void> {
    try {
      await postgresPool.query(query, params);
    } catch (error: unknown) {
      if (isUniqueViolation(error)) {
        throw new DuplicateResourceError(
          'Já existe um treinador cadastrado com este e-mail.',
        );
      }
      throw error;
    }
  }

  private toEntity(row: TrainerRow): Trainer {
    return new Trainer({
      id: row.id,
      name: row.name,
      email: row.email,
      age: row.age,
      city: row.city,
    });
  }
}
