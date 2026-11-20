import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Matches,
} from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullAddress!: string;

  @ApiProperty({
    description: 'Optional nearby landmark',
    example: 'Near D-Mart',
    required: false,
  })
  @IsString()
  @IsOptional()
  landmark?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state!: string;

  @ApiProperty()
  @Matches(/^\d{6}$/, {
    message: 'Pincode must be a valid 6-digit number',
  })
  pincode!: string;

  @ApiProperty({
    description: 'Latitude captured from the map picker',
    example: 19.1364,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude captured from the map picker',
    example: 72.8296,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description:
      "Set this address as default. Server auto-sets this true regardless of input if it is the user's first address.",
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class UpdateAddressDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fullAddress?: string;

  @ApiProperty({
    description: 'Optional nearby landmark',
    example: 'Near D-Mart',
    required: false,
  })
  @IsString()
  @IsOptional()
  landmark?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty()
  @IsOptional()
  @Matches(/^\d{6}$/, {
    message: 'Pincode must be a valid 6-digit number',
  })
  pincode?: string;

  @ApiProperty({
    description: 'Latitude captured from the map picker',
    example: 19.1364,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    description: 'Longitude captured from the map picker',
    example: 72.8296,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({
    description: 'Set this address as default',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}