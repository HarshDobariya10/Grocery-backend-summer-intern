import { LoginType, UserType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notificationToken?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  userName?: string;
}