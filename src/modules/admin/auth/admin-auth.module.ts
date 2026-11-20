import { Module } from '@nestjs/common';
import { AdminAuthController } from './admin-auth.controller';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginJwtStrategy } from './strategies/admin-login-jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserCoreModule } from 'src/core/user-core/user-core.module';
import { UserSessionCoreModule } from 'src/core/user-session-core/user-session-core.module';

@Module({
  imports: [
    UserCoreModule,
    UserSessionCoreModule,
    JwtModule,
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, AdminLoginJwtStrategy],
  exports: [AdminAuthService],
})
export class AdminAuthModule {}
