import { Injectable } from '@nestjs/common';
import { Address, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { AddressCorePaginateDto } from './dto/address-core.dto';

@Injectable()
export class AddressCoreService extends PrismaBaseRepository<
  Address,
  AddressCorePaginateDto,
  Prisma.AddressCreateArgs,
  Prisma.AddressCreateManyArgs,
  Prisma.AddressUpdateArgs,
  Prisma.AddressUpdateManyArgs,
  Prisma.AddressFindUniqueArgs,
  Prisma.AddressFindFirstArgs,
  Prisma.AddressFindManyArgs,
  Prisma.AddressDeleteArgs,
  Prisma.AddressDeleteManyArgs,
  Prisma.AddressCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.address, {
      NOT_FOUND: 'Address not found.',
      DELETED: 'Address is deleted.',
    });
  }
}

