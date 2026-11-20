import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { PrismaService } from './shared/modules/prisma/prisma.service';
import { CustomerModule } from './modules/customer/customer.module';
import { DriverModule } from './modules/driver/driver.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CustomerModule,
    AdminModule,
    DriverModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
