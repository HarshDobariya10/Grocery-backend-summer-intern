import { Injectable } from '@nestjs/common';
import { OrderItem, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { OrderItemCorePaginateDto } from './dto/order-item-core.dto';

@Injectable()
export class OrderItemCoreService extends PrismaBaseRepository<
  OrderItem,
  OrderItemCorePaginateDto,
  Prisma.OrderItemCreateArgs,
  Prisma.OrderItemCreateManyArgs,
  Prisma.OrderItemUpdateArgs,
  Prisma.OrderItemUpdateManyArgs,
  Prisma.OrderItemFindUniqueArgs,
  Prisma.OrderItemFindFirstArgs,
  Prisma.OrderItemFindManyArgs,
  Prisma.OrderItemDeleteArgs,
  Prisma.OrderItemDeleteManyArgs,
  Prisma.OrderItemCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.orderItem, {
      NOT_FOUND: 'Order item not found.',
      DELETED: 'Order item is deleted.',
    });
  }
}

