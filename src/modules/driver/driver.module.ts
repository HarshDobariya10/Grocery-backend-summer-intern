import { Module } from '@nestjs/common';
import { DriverAuthModule } from './auth/auth.module';
import { DriverProfileModule } from './profile/profile.module';

/**
 * Root driver module.
 * Sub-modules: auth, profile.
 * Future sub-modules (orders, earnings) will be added here.
 */
@Module({
  imports: [DriverAuthModule, DriverProfileModule],
  controllers: [],
  providers: [],
})
export class DriverModule {}
