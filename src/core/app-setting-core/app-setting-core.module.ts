import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { AppSettingCoreService } from './app-setting-core.service';

@Module({
  providers: [AppSettingCoreService, PrismaService],
  exports: [AppSettingCoreService],
})
export class AppSettingCoreModule {}
