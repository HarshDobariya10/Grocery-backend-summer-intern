import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

/**
 * Sent by the mobile app to trigger OTP delivery.
 * The phone must be a valid 10-digit Indian number (with or without +91 prefix).
 */
export class SendOtpDto {
  @ApiProperty({
    description: 'Driver phone number (10-digit or with +91 prefix)',
    example: '+919876543210',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+91)?[6-9]\d{9}$/, {
    message: 'phone must be a valid 10-digit Indian mobile number',
  })
  phone: string;
}
