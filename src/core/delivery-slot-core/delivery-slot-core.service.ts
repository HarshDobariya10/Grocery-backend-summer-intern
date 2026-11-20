import { Injectable } from '@nestjs/common';
import { DeliverySlot, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { AppSettingMessages } from 'src/shared/keys';
import { DeliverySlotCorePaginateDto } from './dto/delivery-slot-core.dto';

@Injectable()
export class DeliverySlotCoreService extends PrismaBaseRepository<
  DeliverySlot,
  DeliverySlotCorePaginateDto,
  Prisma.DeliverySlotCreateArgs,
  Prisma.DeliverySlotCreateManyArgs,
  Prisma.DeliverySlotUpdateArgs,
  Prisma.DeliverySlotUpdateManyArgs,
  Prisma.DeliverySlotFindUniqueArgs,
  Prisma.DeliverySlotFindFirstArgs,
  Prisma.DeliverySlotFindManyArgs,
  Prisma.DeliverySlotDeleteArgs,
  Prisma.DeliverySlotDeleteManyArgs,
  Prisma.DeliverySlotCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.deliverySlot, {
      NOT_FOUND: AppSettingMessages.NOT_FOUND,
      DELETED: AppSettingMessages.NOT_FOUND,
    });
  }
}
