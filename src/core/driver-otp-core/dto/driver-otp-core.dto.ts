import { IsOptional, IsString } from 'class-validator';

export class DriverOtpCorePaginateDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
