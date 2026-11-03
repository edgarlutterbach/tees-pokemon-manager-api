import { randomUUID } from 'node:crypto';
import { ValidationError } from '@domain/errors/validation-error';
import { TrainerRole } from './trainer-role';

interface TrainerProps {
  id?: string;
  name: string;
  email: string;
  age: number;
  city: string;
  password: string;
  role: TrainerRole;
}

export class Trainer {
  static readonly MAX_TEAM_SIZE = 6;
  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly age: number;
  readonly city: string;
  readonly password: string;
  readonly role: TrainerRole;

  constructor(props: TrainerProps) {
    const email = props.email.trim().toLowerCase();

    if (!Trainer.EMAIL_PATTERN.test(email)) {
      throw new ValidationError('E-mail inválido.');
    }

    if (!Number.isInteger(props.age) || props.age <= 0) {
      throw new ValidationError('A idade deve ser um número inteiro positivo.');
    }

    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.email = email;
    this.age = props.age;
    this.city = props.city;
    this.password = props.password;
    this.role = props.role;
  }

  withRole(role: TrainerRole): Trainer {
    return new Trainer({
      id: this.id,
      name: this.name,
      email: this.email,
      age: this.age,
      city: this.city,
      password: this.password,
      role,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      age: this.age,
      city: this.city,
      role: this.role,
    };
  }
}
