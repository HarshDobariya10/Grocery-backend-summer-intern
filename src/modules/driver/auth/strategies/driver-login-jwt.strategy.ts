import { Injectable } from '@nestjs/common';
import { DriverAuthService } from '../auth.service';

/**
 * Strategy that validates the Firebase ID token on every protected driver route.
 * Mirrors the customer UserLoginJwtStrategy — delegates to DriverAuthService
 * which also asserts userType === DRIVER.
 */
@Injectable()
export class DriverLoginJwtStrategy {
  constructor(private readonly authService: DriverAuthService) {}

  async validate(request: Request & { headers: { authorization: string } }) {
    return this.authService.performJWTStrategy({ request });
  }
}
