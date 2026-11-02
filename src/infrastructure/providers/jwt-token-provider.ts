import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { TrainerRole } from '@domain/entities/trainer-role';
import { UnauthorizedError } from '@domain/errors/unauthorized-error';
import { TokenPayload, TokenProvider } from '@domain/providers/token-provider';

const ROLES: readonly string[] = Object.values(TrainerRole);

export class JwtTokenProvider implements TokenProvider {
  static readonly ALGORITHM = 'HS256';
  static readonly EXPIRES_IN = '1d';
  static readonly MIN_SECRET_LENGTH = 32;

  private readonly secret: string;

  constructor(secret: string) {
    if (secret.length < JwtTokenProvider.MIN_SECRET_LENGTH) {
      throw new Error(
        `JWT_SECRET deve ter no mínimo ${JwtTokenProvider.MIN_SECRET_LENGTH} caracteres`,
      );
    }

    this.secret = secret;
  }

  generate({ subject, role }: TokenPayload): string {
    return sign({ role }, this.secret, {
      subject,
      algorithm: JwtTokenProvider.ALGORITHM,
      expiresIn: JwtTokenProvider.EXPIRES_IN,
    });
  }

  verify(token: string): TokenPayload {
    let decoded: string | JwtPayload;

    try {
      decoded = verify(token, this.secret, {
        algorithms: [JwtTokenProvider.ALGORITHM],
      });
    } catch {
      throw new UnauthorizedError('Token JWT inválido ou expirado');
    }

    if (
      typeof decoded === 'string' ||
      typeof decoded.sub !== 'string' ||
      typeof decoded.role !== 'string' ||
      !ROLES.includes(decoded.role)
    ) {
      throw new UnauthorizedError('Token JWT inválido ou expirado');
    }

    return { subject: decoded.sub, role: decoded.role as TrainerRole };
  }
}
