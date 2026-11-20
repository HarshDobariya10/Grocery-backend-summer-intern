import { Module } from '@nestjs/common';
import { AppSettingCoreModule } from 'src/core/app-setting-core';
import { AdminAuthModule } from '../auth/admin-auth.module';
import { AppSettingController } from './app-setting.controller';
import { AppSettingService } from './app-setting.service';
import { DeliverySlotCoreModule } from 'src/core/delivery-slot-core';

@Module({
  imports: [AppSettingCoreModule, AdminAuthModule, DeliverySlotCoreModule],
  controllers: [AppSettingController],
  providers: [AppSettingService],
})
export class AppSettingModule {}
