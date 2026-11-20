import { ApiProperty } from '@nestjs/swagger';
import { DeliverySlot } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../base-query-core/dto';

export class DeliverySlotCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: DeliverySlot[];
}
