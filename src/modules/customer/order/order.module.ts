import { Module } from '@nestjs/common';
import { AddressCoreModule } from 'src/core/address-core';
import { AppSettingCoreModule } from 'src/core/app-setting-core';
import { DeliverySlotCoreModule } from 'src/core/delivery-slot-core';
import { OrderCoreModule } from 'src/core/order-core';
import { ProductCoreModule } from 'src/core/product-core';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { UserLoginJwtGuard } from '../auth/guards/user-login-jwt.guard';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    AuthModule,
    AddressCoreModule,
    OrderCoreModule,
    DeliverySlotCoreModule,
    ProductCoreModule,
    AppSettingCoreModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, PrismaService, UserLoginJwtGuard],
})
export class OrderModule {}
