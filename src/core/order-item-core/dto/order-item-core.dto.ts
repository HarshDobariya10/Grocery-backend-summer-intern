import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../base-query-core/dto';
import { OrderItem } from '@prisma/client';

export class OrderItemCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: OrderItem[];
}

