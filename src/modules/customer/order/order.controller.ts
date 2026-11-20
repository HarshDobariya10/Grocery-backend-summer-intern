import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { BaseQueryCoreDto } from 'src/core/base-query-core/dto';
import { GetUserSession } from 'src/shared/decorators';
import { UserSessionType } from 'src/shared/types';
import { UserLoginJwtGuard } from '../auth/guards/user-login-jwt.guard';
import { CreateOrderDto } from './dto';
import { OrderService } from './order.service';

@ApiTags('Customer - Orders')
@ApiBearerAuth()
@UseGuards(UserLoginJwtGuard)
@Controller('api/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('checkout')
  @ApiOperation({ summary: 'Get checkout data' })
  async getCheckoutData() {
    return await this.orderService.getCheckoutData();
  }

  @Post()
  @ApiOperation({ summary: 'Create order' })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.orderService.createOrder(createOrderDto, sessionData);
  }

  @Get()
  @ApiOperation({ summary: 'Get my orders' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: [
      'PENDING',
      'ACCEPTED',
      'PACKED',
      'DRIVER_ASSIGNED',
      'OUT_FOR_DELIVERY',
      'DELIVERED',
      'CANCELLED',
    ],
  })
  async getMyOrders(
    @GetUserSession() sessionData: UserSessionType,
    @Query() baseQueryCoreDto: BaseQueryCoreDto,
    @Query('status') status?: OrderStatus,
  ) {
    return await this.orderService.getMyOrders({
      baseQueryCoreDto,
      status,
      session: sessionData,
    });
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order by id' })
  async getOrderById(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.orderService.getOrderById(orderId, sessionData);
  }

  @Patch(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  async cancelOrder(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return await this.orderService.cancelOrder(orderId, sessionData);
  }
}
