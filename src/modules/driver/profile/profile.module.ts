import { Module } from '@nestjs/common';
import { DriverProfileService } from './profile.service';
import { DriverProfileController } from './profile.controller';
import { DriverProfileCoreModule } from 'src/core/driver-profile-core/driver-profile-core.module';
import { DriverAuthModule } from '../auth/auth.module';

/**
 * DriverProfileModule exposes all profile-management APIs:
 *   GET    /api/driver/profile
 *   PUT    /api/driver/profile
 *   PUT    /api/driver/profile/photo
 *   PATCH  /api/driver/online-status
 *   PUT    /api/driver/settings
 *
 * Re-uses DriverAuthModule (imported for DriverLoginJwtGuard / strategy)
 * and DriverProfileCoreModule for DB operations.
 */
@Module({
  imports: [
    DriverProfileCoreModule,
    DriverAuthModule, // re-exports DriverLoginJwtGuard & DriverLoginJwtStrategy
  ],
  controllers: [DriverProfileController],
  providers: [DriverProfileService],
})
export class DriverProfileModule {}
