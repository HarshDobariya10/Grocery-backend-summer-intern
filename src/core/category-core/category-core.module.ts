import { Module } from '@nestjs/common';
import { CategoryCoreService } from './category-core.service';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';

@Module({
  providers: [CategoryCoreService, PrismaService],
  exports: [CategoryCoreService],
})
export class CategoryCoreModule {}
