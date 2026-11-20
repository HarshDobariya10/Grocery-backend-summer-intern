import { Injectable } from '@nestjs/common';
import { DriverOtp, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { DriverOtpCorePaginateDto } from './dto/driver-otp-core.dto';
import { DriverMessages } from '../../shared/keys/user.keys';

@Injectable()
export class DriverOtpCoreService extends PrismaBaseRepository<
  DriverOtp,
  DriverOtpCorePaginateDto,
  Prisma.DriverOtpCreateArgs,
  Prisma.DriverOtpCreateManyArgs,
  Prisma.DriverOtpUpdateArgs,
  Prisma.DriverOtpUpdateManyArgs,
  Prisma.DriverOtpFindUniqueArgs,
  Prisma.DriverOtpFindFirstArgs,
  Prisma.DriverOtpFindManyArgs,
  Prisma.DriverOtpDeleteArgs,
  Prisma.DriverOtpDeleteManyArgs,
  Prisma.DriverOtpCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.driverOtp, {
      NOT_FOUND: DriverMessages.OTP_INVALID,
      DELETED: DriverMessages.OTP_EXPIRED,
    });
  }
}
