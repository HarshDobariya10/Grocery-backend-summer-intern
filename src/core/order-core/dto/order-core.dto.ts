import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../base-query-core/dto';
import { Order } from '@prisma/client';

export class OrderCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: Order[];
}

