import { randomUUID } from 'node:crypto';
import { DomainError } from '@domain/errors/domain-error';
import { ErrorCode } from '@domain/errors/error-code';

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
      throw new DomainError('E-mail inválido.', ErrorCode.INVALID_ATTRIBUTES);
    }

    if (!Number.isInteger(props.age) || props.age <= 0) {
      throw new DomainError(
        'A idade deve ser um número inteiro positivo.',
        ErrorCode.INVALID_ATTRIBUTES,
      );
    }

    this.id = props.id ?? randomUUID();
    this.name = props.name;
    this.email = email;
    this.age = props.age;
    this.city = props.city;
  }
}
