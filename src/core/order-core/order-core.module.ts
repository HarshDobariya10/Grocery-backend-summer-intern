import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { OrderCoreService } from './order-core.service';

@Module({
  providers: [OrderCoreService, PrismaService],
  exports: [OrderCoreService],
})
export class OrderCoreModule {}

