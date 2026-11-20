import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDriverProfileDto {
  // ── Personal ─────────────────────────────────────────────────────────────

  @ApiPropertyOptional({ example: 'Ravi Kumar' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  fullName?: string;

  @ApiPropertyOptional({ example: 'ravi@example.com' })
  @IsOptional()
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  city?: string;

  // ── Vehicle ───────────────────────────────────────────────────────────────

  @ApiPropertyOptional({ example: 'Honda Activa' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }: { value: string }) => value?.trim())
  vehicleName?: string;

  @ApiPropertyOptional({ example: 'MH01AB1234' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }: { value: string }) => value?.trim().toUpperCase())
  plateNumber?: string;

  @ApiPropertyOptional({ example: 'DL-0420110012345' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(({ value }: { value: string }) => value?.trim())
  licenseNumber?: string;
}
