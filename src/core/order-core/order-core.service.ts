import { Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { OrderCorePaginateDto } from './dto/order-core.dto';

@Injectable()
export class OrderCoreService extends PrismaBaseRepository<
  Order,
  OrderCorePaginateDto,
  Prisma.OrderCreateArgs,
  Prisma.OrderCreateManyArgs,
  Prisma.OrderUpdateArgs,
  Prisma.OrderUpdateManyArgs,
  Prisma.OrderFindUniqueArgs,
  Prisma.OrderFindFirstArgs,
  Prisma.OrderFindManyArgs,
  Prisma.OrderDeleteArgs,
  Prisma.OrderDeleteManyArgs,
  Prisma.OrderCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.order, {
      NOT_FOUND: 'Order not found.',
      DELETED: 'Order is deleted.',
    });
  }
}

