import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class UpdateDeliverySlotDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  maxOrders?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateAppSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  delivery_charge_express?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  delivery_charge_eco?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  min_order_value?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  low_stock_threshold?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  express_delivery_enabled?: boolean;

  @ApiPropertyOptional({ type: [UpdateDeliverySlotDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDeliverySlotDto)
  deliverySlots?: UpdateDeliverySlotDto[];
}