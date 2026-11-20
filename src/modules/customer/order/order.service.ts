import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  DeliveryType,
  OrderStatus,
  Prisma,
  UserType,
} from '@prisma/client';
import { AddressCoreService } from 'src/core/address-core';
import { AppSettingCoreService } from 'src/core/app-setting-core';
import { DeliverySlotCoreService } from 'src/core/delivery-slot-core';
import { OrderCoreService } from 'src/core/order-core';
import { ProductCoreService } from 'src/core/product-core';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { UserSessionType } from 'src/shared/types';
import { CreateOrderDto } from './dto';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private addressCoreService: AddressCoreService,
    private orderCoreService: OrderCoreService,
    private deliverySlotCoreService: DeliverySlotCoreService,
    private productCoreService: ProductCoreService,
    private appSettingCoreService: AppSettingCoreService,
  ) {}

  async getCheckoutData() {
    const [deliverySlots, expressSetting, ecoSetting] = await Promise.all([
      this.deliverySlotCoreService.findMany({
        where: { isDeleted: false, isActive: true },
        orderBy: [{ createdAt: 'asc' }],
      }),
      this.appSettingCoreService.findUnique({
        where: { key: 'delivery_charge_express' },
      }),
      this.appSettingCoreService.findUnique({
        where: { key: 'delivery_charge_eco' },
      }),
    ]);

    return {
      deliverySlots,
      deliveryCharges: {
        express: Number(expressSetting?.value ?? 0),
        eco: Number(ecoSetting?.value ?? 0),
      },
    };
  }

  async createOrder(dto: CreateOrderDto, session: UserSessionType) {
    if (session.user.userType !== UserType.CUSTOMER) {
      throw new ForbiddenException();
    }

    if (!dto.items?.length) {
      throw new BadRequestException('Order items are required.');
    }

    const address = await this.addressCoreService.findFirst({
      where: {
        id: dto.addressId,
        userId: session.user.id,
        isDeleted: false,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found.');
    }

    const products = await this.productCoreService.findMany({
      where: {
        id: { in: dto.items.map((item) => item.productId) },
        isDeleted: false,
        isActive: true,
      },
    });

    if (products.length !== dto.items.length) {
      throw new BadRequestException('One or more products are invalid.');
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    let subtotal = new Prisma.Decimal(0);

    const orderItems = dto.items.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new BadRequestException('One or more products are invalid.');
      }

      if (product.stockQty < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}.`,
        );
      }

      const unitPrice = new Prisma.Decimal(product.price);
      const totalPrice = unitPrice.mul(item.quantity);
      subtotal = subtotal.add(totalPrice);

      return {
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        unitType: product.unitType,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      };
    });

    const deliveryCharge = await this.resolveDeliveryCharge(dto.deliveryType);
    const total = subtotal.add(deliveryCharge);
    const displayId = `ORD-${Date.now().toString().slice(-8)}`;

    const createdOrder = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          displayId,
          userId: session.user.id,
          addressId: dto.addressId,
          slotId: dto.slotId,
          status: OrderStatus.PENDING,
          deliveryType: dto.deliveryType ?? DeliveryType.EXPRESS,
          scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : null,
          subtotal,
          deliveryCharge,
          total,
          instructions: dto.instructions,
          paymentMethod: dto.paymentMethod ?? 'COD',
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
          address: true,
          slot: true,
        },
      });

      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQty: {
              decrement: item.quantity,
            },
          },
        });
      }

      return order;
    });

    return createdOrder;
  }

  async getMyOrders(param: {
    baseQueryCoreDto: BaseQueryCoreDto;
    session: UserSessionType;
    status?: OrderStatus;
  }) {
    const { baseQueryCoreDto, session, status } = param;

    const whereQuery: any = {
      userId: session.user.id,
      isDeleted: false,
      ...(status && { status }),
    };

    return this.orderCoreService.findPaginate(baseQueryCoreDto, whereQuery);
  }

  async getOrderById(orderId: string, session: UserSessionType) {
    const order = await this.orderCoreService.findFirst({
      where: {
        id: orderId,
        userId: session.user.id,
        isDeleted: false,
      },
      include: {
        items: true,
        address: true,
        slot: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found.');
    }

    return order;
  }

  async cancelOrder(orderId: string, session: UserSessionType) {
    const order = await this.getOrderById(orderId, session);

    if (
      order.status === OrderStatus.DELIVERED ||
      order.status === OrderStatus.CANCELLED
    ) {
      throw new BadRequestException('Order cannot be cancelled.');
    }

    return this.orderCoreService.update({
      where: { id: order.id },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });
  }

  private async resolveDeliveryCharge(deliveryType?: DeliveryType) {
    const key =
      deliveryType === DeliveryType.ECO
        ? 'delivery_charge_eco'
        : 'delivery_charge_express';

    const setting = await this.appSettingCoreService.findUnique({
      where: { key },
    });

    return new Prisma.Decimal(setting?.value ?? 0);
  }
}
