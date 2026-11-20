import { Injectable } from '@nestjs/common';
import { AdminAuthService } from '../admin-auth.service';

@Injectable()
export class AdminLoginJwtStrategy {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  async validate(request: Request & { headers: { authorization: string } }) {
    return this.adminAuthService.performJWTStrategy({
      request,
    });
  }
}
