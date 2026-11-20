import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserLoginJwtStrategy } from './strategies/user-login-jwt.strategy';
import { UserLoginJwtGuard } from './guards/user-login-jwt.guard';
import { UserCoreModule } from 'src/core/user-core/user-core.module';
import { UserSessionCoreModule } from 'src/core/user-session-core/user-session-core.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule,
    UserCoreModule,
    UserSessionCoreModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserLoginJwtStrategy, UserLoginJwtGuard],
  exports: [AuthService],
})
export class AuthModule {}
