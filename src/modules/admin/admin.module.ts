import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module';
import { CategoryModule } from './category/category.module';
import { AppSettingModule } from './settings/app-setting.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AdminAuthModule, CategoryModule, ProductModule, AppSettingModule],
  controllers: [],
  providers: [],
})
export class AdminModule {}
