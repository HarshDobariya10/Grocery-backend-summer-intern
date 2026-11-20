import { ApiProperty } from '@nestjs/swagger';
import { Address } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../base-query-core/dto';

export class AddressCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: Address[];
}

