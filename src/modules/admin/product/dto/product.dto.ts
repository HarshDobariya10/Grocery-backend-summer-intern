import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 120, {
    message: 'Product name must be between 2 and 120 characters.',
  })
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 5000, {
    message: 'Description must be between 1 and 5000 characters.',
  })
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number with up to 2 decimal places.' },
  )
  @Min(0.01, { message: 'Price must be greater than 0.' })
  price: number;

  @ApiPropertyOptional({ default: 0 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Stock quantity must be zero or greater.' })
  stockQty?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, {
    message: 'Unit type must be between 1 and 100 characters.',
  })
  unitType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional({ default: true })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ default: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;

  @ApiPropertyOptional({ default: false })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;
}

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(2, 120, {
    message: 'Product name must be between 2 and 120 characters.',
  })
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 5000, {
    message: 'Description must be between 1 and 5000 characters.',
  })
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number with up to 2 decimal places.' },
  )
  @Min(0.01, { message: 'Price must be greater than 0.' })
  price?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'Stock quantity must be zero or greater.' })
  stockQty?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 100, {
    message: 'Unit type must be between 1 and 100 characters.',
  })
  unitType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isBestSeller?: boolean;

  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isRecommended?: boolean;
}
