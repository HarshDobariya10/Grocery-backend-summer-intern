import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

/**
 * Sent by the mobile app after the driver enters the 4-digit OTP.
 * On success, returns a Firebase custom token + full driver profile.
 */
export class VerifyOtpDto {
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

  @ApiProperty({
    description: '4-digit OTP received on the phone',
    example: '4821',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'otp must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'otp must contain only digits' })
  otp: string;

  @ApiProperty({
    description: 'FCM token for push notifications (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  notificationToken?: string;

  @ApiProperty({
    description: "Driver's display name (optional, used on first sign-up)",
    required: false,
  })
  @IsOptional()
  @IsString()
  fullName?: string;
}
