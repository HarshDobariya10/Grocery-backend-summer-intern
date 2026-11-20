import { IsOptional, IsString } from 'class-validator';

export class DriverProfileCorePaginateDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
