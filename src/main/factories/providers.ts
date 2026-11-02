import { HashProvider } from '@domain/providers/hash-provider';
import { TokenProvider } from '@domain/providers/token-provider';
import { BcryptHashProvider } from '@infrastructure/providers/bcrypt-hash-provider';
import { JwtTokenProvider } from '@infrastructure/providers/jwt-token-provider';
import { requireEnv } from '@main/config/env';

const hashProvider: HashProvider = new BcryptHashProvider();
const tokenProvider: TokenProvider = new JwtTokenProvider(
  requireEnv('JWT_SECRET'),
);

export { hashProvider, tokenProvider };
