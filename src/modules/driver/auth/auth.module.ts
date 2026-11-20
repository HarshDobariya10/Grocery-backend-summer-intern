import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DriverAuthService } from './auth.service';
import { DriverAuthController } from './auth.controller';
import { DriverLoginJwtStrategy } from './strategies/driver-login-jwt.strategy';
import { DriverLoginJwtGuard } from './guards/driver-login-jwt.guard';
import { UserCoreModule } from 'src/core/user-core/user-core.module';
import { UserSessionCoreModule } from 'src/core/user-session-core/user-session-core.module';
import { DriverProfileCoreModule } from 'src/core/driver-profile-core/driver-profile-core.module';

@Module({
  imports: [
    ConfigModule,
    UserCoreModule,
    UserSessionCoreModule,
    DriverProfileCoreModule, // needed to create DriverProfile on first login
  ],
  controllers: [DriverAuthController],
  providers: [DriverAuthService, DriverLoginJwtStrategy, DriverLoginJwtGuard],
  exports: [DriverAuthService, DriverLoginJwtStrategy, DriverLoginJwtGuard],
})
export class DriverAuthModule {}
