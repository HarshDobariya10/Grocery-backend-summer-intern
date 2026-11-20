import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { OrderItemCoreService } from './order-item-core.service';

@Module({
  providers: [OrderItemCoreService, PrismaService],
  exports: [OrderItemCoreService],
})
export class OrderItemCoreModule {}

