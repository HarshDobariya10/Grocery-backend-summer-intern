import { Module } from '@nestjs/common';
import { UploadModule } from '../../shared/modules/upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [UploadModule, AuthModule , CategoryModule , ProductModule, OrderModule, AddressModule],
  controllers: [],
  providers: [],
})
export class CustomerModule {}
