import { Injectable } from '@nestjs/common';
import { DriverProfile, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { DriverProfileCorePaginateDto } from './dto/driver-profile-core.dto';
import { DriverMessages } from '../../shared/keys/user.keys';

@Injectable()
export class DriverProfileCoreService extends PrismaBaseRepository<
  DriverProfile,
  DriverProfileCorePaginateDto,
  Prisma.DriverProfileCreateArgs,
  Prisma.DriverProfileCreateManyArgs,
  Prisma.DriverProfileUpdateArgs,
  Prisma.DriverProfileUpdateManyArgs,
  Prisma.DriverProfileFindUniqueArgs,
  Prisma.DriverProfileFindFirstArgs,
  Prisma.DriverProfileFindManyArgs,
  Prisma.DriverProfileDeleteArgs,
  Prisma.DriverProfileDeleteManyArgs,
  Prisma.DriverProfileCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.driverProfile, {
      NOT_FOUND: DriverMessages.NOT_FOUND,
      DELETED: DriverMessages.DELETED,
    });
  }
}
