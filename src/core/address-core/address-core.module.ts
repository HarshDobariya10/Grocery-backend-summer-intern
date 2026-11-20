import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { AddressCoreService } from './address-core.service';

@Module({
  providers: [AddressCoreService, PrismaService],
  exports: [AddressCoreService],
})
export class AddressCoreModule {}

