import { ApiProperty } from '@nestjs/swagger';
import { AppSetting } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../base-query-core/dto';

export class AppSettingCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: AppSetting[];
}
