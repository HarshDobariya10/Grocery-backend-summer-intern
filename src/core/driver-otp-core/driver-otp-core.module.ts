import { Module } from '@nestjs/common';
import { DriverOtpCoreService } from './driver-otp-core.service';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [DriverOtpCoreService, PrismaService],
  exports: [DriverOtpCoreService],
})
export class DriverOtpCoreModule {}
