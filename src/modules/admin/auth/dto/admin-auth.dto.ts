import { ApiProperty } from '@nestjs/swagger';
import { LoginType } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, IsOptional, Length, IsEnum } from 'class-validator';

export class AdminCreateDto {
  @ApiProperty()
  @IsEnum(LoginType)
  @IsNotEmpty()
  loginType?: LoginType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  notificationToken?: string;
} 

export class AdminLoginDto {
  @ApiProperty({
    description: 'Optional notification token for push notifications',
    example: 'fcm_token_here',
    required: false,
  })
  @IsString()
  @IsOptional()
  notificationToken?: string;
}