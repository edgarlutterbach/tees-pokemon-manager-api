import { compare, hash } from 'bcryptjs';
import { HashProvider } from '@domain/providers/hash-provider';

export class BcryptHashProvider implements HashProvider {
  static readonly SALT_ROUNDS = 10;

  async generateHash(payload: string): Promise<string> {
    return hash(payload, BcryptHashProvider.SALT_ROUNDS);
  }

  async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
