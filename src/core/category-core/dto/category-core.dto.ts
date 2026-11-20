import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../base-query-core/dto';

export class CategoryCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: Category[];
}
