import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminLoginJwtStrategy } from '../strategies/admin-login-jwt.strategy';
import { AdminAuthService } from '../admin-auth.service';

@Injectable()
export class AdminLoginJwtGuard extends AdminLoginJwtStrategy {
  constructor(
    private readonly reflector: Reflector,
    authService: AdminAuthService,
  ) {
    super(authService);
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    return super.validate(context.switchToHttp().getRequest());
  }
}
