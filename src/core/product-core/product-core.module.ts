import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { ProductCoreService } from './product-core.service';

@Module({
  providers: [ProductCoreService, PrismaService],
  exports: [ProductCoreService],
})
export class ProductCoreModule {}
