import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { UserService } from '../user/user.service';
import { type EnvConfig, envConfig } from 'src/config/env';
import { FIREBASE_JWKS_URL } from '../constants';
import '../../../types/express';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    @Inject(envConfig.KEY) private readonly config: EnvConfig,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<{ req: Request }>();

    // 1. Extract the Bearer Token
    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('Missing or Invalid token');
    }

    try {
      // 2. Verify with jose using Firebase JWKS
      const jwks = createRemoteJWKSet(new URL(FIREBASE_JWKS_URL));
      const { payload } = await jwtVerify(token, jwks, {
        issuer: this.config.JWT_ISSUER,
        audience: this.config.JWT_AUDIENCE,
      });

      // 3. Find the user and attach to request (Manual Attachment)
      const user = await this.userService.findUserByEmail(
        payload.email as string,
      );
      if (!user) throw new UnauthorizedException();

      req.user = user; // This is where the @CurrentUser decorator gets it!
      return true;
    } catch (err) {
      console.error('JWT Verification Error:', err);
      throw new UnauthorizedException('Token verification failed');
    }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) return null;

    return token;
  }
}
