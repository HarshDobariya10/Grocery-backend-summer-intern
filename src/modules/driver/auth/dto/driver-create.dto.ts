import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DriverLoginDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notificationToken?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userName?: string;
}