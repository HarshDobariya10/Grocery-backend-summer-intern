import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { DeliverySlotCoreService } from './delivery-slot-core.service';

@Module({
  providers: [DeliverySlotCoreService, PrismaService],
  exports: [DeliverySlotCoreService],
})
export class DeliverySlotCoreModule {}
