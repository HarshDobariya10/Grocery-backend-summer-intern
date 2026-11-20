import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { DeliveryType } from '@prisma/client';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slotId?: string;

  @ApiProperty({ enum: DeliveryType, default: DeliveryType.EXPRESS })
  @IsEnum(DeliveryType)
  @IsOptional()
  deliveryType?: DeliveryType;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  instructions?: string;

  @ApiPropertyOptional({ default: 'COD' })
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
