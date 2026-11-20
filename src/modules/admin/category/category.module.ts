import { Module } from '@nestjs/common';
import { BaseQueryCoreModule } from 'src/core/base-query-core';
import { CategoryCoreModule } from 'src/core/category-core';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { AdminAuthModule } from '../auth/admin-auth.module';
import { ProductCoreModule } from 'src/core/product-core';

@Module({
  imports: [
    CategoryCoreModule,
    BaseQueryCoreModule,
    AdminAuthModule,
    ProductCoreModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
