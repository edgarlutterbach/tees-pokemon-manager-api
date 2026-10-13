import { randomUUID } from 'node:crypto';
import { ValidationError } from '@domain/errors/validation-error';

interface TrainerProps {
  id?: string;
  name: string;
  email: string;
  age: number;
  city: string;
}

export class Trainer {
  private static readonly EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly age: number;
  readonly city: string;

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
  }
}
