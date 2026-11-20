import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { DriverProfileService } from './profile.service';
import { UpdateDriverProfileDto, UpdateDriverSettingsDto } from './dto';
import { DriverLoginJwtGuard } from '../auth/guards/driver-login-jwt.guard';
import { GetUserSession } from 'src/shared/decorators';
import { UserSessionType } from 'src/shared/types';

@ApiTags('Driver - Profile')
@ApiBearerAuth()
@UseGuards(DriverLoginJwtGuard)
@Controller('api/driver')
export class DriverProfileController {
  constructor(private readonly driverProfileService: DriverProfileService) {}

  // ─── GET /api/driver/profile ─────────────────────────────────────────────

  @Get('profile')
  @ApiOperation({ summary: 'Get complete driver profile' })
  async getProfile(@GetUserSession() sessionData: UserSessionType) {
    return this.driverProfileService.getProfile(sessionData);
  }

  // ─── PUT /api/driver/profile ─────────────────────────────────────────────

  @Put('profile')
  @ApiOperation({
    summary: 'Update driver profile',
    description:
      'Editable fields: fullName, email, city, vehicleName, plateNumber, licenseNumber. ' +
      'Non-editable: phone, rating, totalDeliveries, driverPartnerId, status.',
  })
  async updateProfile(
    @GetUserSession() sessionData: UserSessionType,
    @Body() dto: UpdateDriverProfileDto,
  ) {
    return this.driverProfileService.updateProfile(sessionData, dto);
  }

  // ─── PUT /api/driver/profile/photo ───────────────────────────────────────

  @Put('profile/photo')
  @ApiOperation({ summary: 'Upload / replace driver profile photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        photo: { type: 'string', format: 'binary' },
      },
      required: ['photo'],
    },
  })
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB cap
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('Only image files are allowed.'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateProfilePhoto(
    @GetUserSession() sessionData: UserSessionType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.driverProfileService.updateProfilePhoto(sessionData, file);
  }

  // ─── PATCH /api/driver/online-status ─────────────────────────────────────

  @Patch('online-status')
  @ApiOperation({
    summary: "Toggle driver's online/offline status",
    description: 'Flips the current isOnline boolean and returns the new state.',
  })
  async toggleOnlineStatus(@GetUserSession() sessionData: UserSessionType) {
    return this.driverProfileService.toggleOnlineStatus(sessionData);
  }

  // ─── PUT /api/driver/settings ─────────────────────────────────────────────

  @Put('settings')
  @ApiOperation({
    summary: 'Update driver notification / location settings',
    description:
      'Accepts pushNotifications, locationSharing, doNotDisturb. ' +
      'When pushNotifications is set to true, also pass fcmToken to register the device.',
  })
  async updateSettings(
    @GetUserSession() sessionData: UserSessionType,
    @Body() dto: UpdateDriverSettingsDto,
  ) {
    return this.driverProfileService.updateSettings(sessionData, dto);
  }
}
