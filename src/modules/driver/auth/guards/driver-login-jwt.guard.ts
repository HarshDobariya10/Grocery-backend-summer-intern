import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DriverAuthService } from '../auth.service';
import { DriverLoginJwtStrategy } from '../strategies/driver-login-jwt.strategy';

/**
 * Guard that runs on every controller decorated with DriverLoginJwtGuard.
 * Mirrors the customer UserLoginJwtGuard pattern:
 *  - Skips validation if the route is marked @Public()
 *  - Otherwise delegates to DriverLoginJwtStrategy.validate()
 */
@Injectable()
export class DriverLoginJwtGuard extends DriverLoginJwtStrategy {
  constructor(
    private readonly reflector: Reflector,
    authService: DriverAuthService,
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
