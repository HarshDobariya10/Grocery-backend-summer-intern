import { Module } from '@nestjs/common';
import { BaseQueryCoreModule } from 'src/core/base-query-core';
import { ProductCoreModule } from 'src/core/product-core';
import { AdminAuthModule } from '../auth/admin-auth.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CategoryCoreModule } from 'src/core/category-core';
import { AppSettingCoreModule } from 'src/core/app-setting-core';

@Module({
  imports: [
    ProductCoreModule,
    BaseQueryCoreModule,
    AdminAuthModule,
    CategoryCoreModule,
    AppSettingCoreModule
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
