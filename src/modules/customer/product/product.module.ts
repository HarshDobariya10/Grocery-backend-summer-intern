import { Module } from '@nestjs/common';
import { ProductCoreModule } from 'src/core/product-core';
import { CategoryCoreModule } from 'src/core/category-core';
import { AppSettingCoreModule } from 'src/core/app-setting-core';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { BaseQueryCoreModule } from 'src/core/base-query-core';

@Module({
  imports: [
    ProductCoreModule,
    CategoryCoreModule,
    BaseQueryCoreModule,
    AppSettingCoreModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}