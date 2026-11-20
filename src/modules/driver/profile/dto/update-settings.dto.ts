import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDriverSettingsDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  locationSharing?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  doNotDisturb?: boolean;

  /**
   * Required when pushNotifications is toggled ON.
   * Saves the device FCM token so the server can push notifications.
   */
  @ApiPropertyOptional({
    example: 'fcm-device-token-string',
    description:
      'FCM device token — send this when enabling push notifications.',
  })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}
