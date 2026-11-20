import { Module } from '@nestjs/common';
import { BaseQueryCoreModule } from 'src/core/base-query-core';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressCoreModule } from 'src/core/address-core';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    BaseQueryCoreModule,
    AddressCoreModule,
    AuthModule
  ],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
