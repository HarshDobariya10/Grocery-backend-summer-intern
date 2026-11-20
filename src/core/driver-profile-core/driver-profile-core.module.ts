import { Module } from '@nestjs/common';
import { DriverProfileCoreService } from './driver-profile-core.service';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [DriverProfileCoreService, PrismaService],
  exports: [DriverProfileCoreService],
})
export class DriverProfileCoreModule {}
