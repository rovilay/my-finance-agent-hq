import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request } from 'express';
import { createRemoteJWKSet, JWTPayload, jwtVerify } from 'jose';
import { UserService } from '../user/user.service';
import { type EnvConfig, envConfig } from 'src/config/env';
import { FIREBASE_JWKS_URL } from '../constants';
import '../../../types/express';

export const extractTokenFromHeader = (request: Request): string | null => {
  const authHeader = request.headers['authorization'];
  if (!authHeader) return null;

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) return null;

  return token;
};

export const verifyToken = async (
  token: string,
  config: EnvConfig,
): Promise<JWTPayload> => {
  const jwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));
  const { payload } = await jwtVerify(token, jwks, {
    issuer: config.JWT_ISSUER,
    audience: config.JWT_AUDIENCE,
  });
  return payload;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(envConfig.KEY) private readonly config: EnvConfig,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 1. Extract the Bearer Token
    const token = extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Missing or Invalid token');
    }

    try {
      // 2. Verify with jose using Firebase JWKS
      const payload = await verifyToken(token, this.config);

      // 3. Find the user and attach to request
      const user = await this.userService.findUserByEmail(
        payload.email as string,
      );
      if (!user) throw new UnauthorizedException('User not found');

      request.user = user;
      return true;
    } catch (err) {
      console.error('JWT Verification Error:', err);
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
