import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../base-query-core/dto';

export class ProductCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: Product[];
}
