import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import admin from 'firebase-admin';
import { Readable } from 'stream';
import { DriverProfileCoreService } from 'src/core/driver-profile-core/driver-profile-core.service';
import { DriverMessages } from 'src/shared/keys';
import { UserSessionType } from 'src/shared/types';
import { UpdateDriverProfileDto } from './dto/update-profile.dto';
import { UpdateDriverSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class DriverProfileService {
  private readonly logger = new Logger(DriverProfileService.name);

  constructor(
    private readonly driverProfileCoreService: DriverProfileCoreService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE: resolve driver profile or throw
  // ─────────────────────────────────────────────────────────────────────────────

  private async resolveProfile(userId: string) {
    const profile = await this.driverProfileCoreService.findFirst({
      where: { userId, isDeleted: false },
    });

    if (!profile) {
      throw new NotFoundException(DriverMessages.NOT_FOUND);
    }

    return profile;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE: shape the response envelope
  // ─────────────────────────────────────────────────────────────────────────────

  private buildProfileResponse(profile: any, user: any) {
    return {
      personal: {
        fullName: profile.fullName,
        phone: user.mobile,
        email: profile.email,
        city: profile.city,
        driverPartnerId: profile.driverPartnerId,
        status: profile.driverStatus,
        rating: profile.rating,
        totalDeliveries: profile.totalDeliveries,
        profilePhoto: profile.profilePhoto,
      },
      vehicle: {
        vehicleName: profile.vehicleName,
        plateNumber: profile.plateNumber,
        licenseNumber: profile.licenseNumber,
      },
      settings: {
        pushNotifications: profile.pushNotifications,
        locationSharing: profile.locationSharing,
        doNotDisturb: profile.doNotDisturb,
      },
      stats: {
        isOnline: profile.isOnline,
        todayEarnings: profile.todayEarnings,
        todayDeliveries: profile.todayDeliveries,
        weeklyEarnings: profile.weeklyEarnings,
        weeklyGoal: profile.weeklyGoal,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GET /api/driver/profile
  // ─────────────────────────────────────────────────────────────────────────────

  async getProfile(sessionData: UserSessionType) {
    const { user } = sessionData;
    const profile = await this.resolveProfile(user.id);
    return this.buildProfileResponse(profile, user);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PUT /api/driver/profile
  // ─────────────────────────────────────────────────────────────────────────────

  async updateProfile(
    sessionData: UserSessionType,
    dto: UpdateDriverProfileDto,
  ) {
    const { user } = sessionData;
    const profile = await this.resolveProfile(user.id);

    const updated = await this.driverProfileCoreService.update({
      where: { id: profile.id },
      data: {
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.city !== undefined && { city: dto.city }),
        ...(dto.vehicleName !== undefined && { vehicleName: dto.vehicleName }),
        ...(dto.plateNumber !== undefined && { plateNumber: dto.plateNumber }),
        ...(dto.licenseNumber !== undefined && {
          licenseNumber: dto.licenseNumber,
        }),
      },
    });

    return {
      message: DriverMessages.PROFILE_UPDATED,
      profile: this.buildProfileResponse(updated, user),
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PUT /api/driver/profile/photo
  // ─────────────────────────────────────────────────────────────────────────────

  async updateProfilePhoto(
    sessionData: UserSessionType,
    file: Express.Multer.File,
  ) {
    const { user } = sessionData;

    if (!file) {
      throw new BadRequestException('No image file provided.');
    }

    const profile = await this.resolveProfile(user.id);

    const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      throw new BadRequestException('FIREBASE_STORAGE_BUCKET is not configured.');
    }

    const ext = file.originalname.split('.').pop() ?? 'jpg';
    const filePath = `driver-photos/${profile.id}.${ext}`;
    const bucket = admin.storage().bucket(bucketName);
    const blob = bucket.file(filePath);

    // Stream the in-memory buffer to Firebase Storage
    await new Promise<void>((resolve, reject) => {
      const stream = blob.createWriteStream({
        metadata: { contentType: file.mimetype },
        resumable: false,
      });

      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(stream).on('error', reject).on('finish', resolve);
    });

    const photoUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(filePath)}?alt=media`;

    await this.driverProfileCoreService.update({
      where: { id: profile.id },
      data: { profilePhoto: photoUrl },
    });

    return {
      message: DriverMessages.PHOTO_UPDATED,
      profilePhoto: photoUrl,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PATCH /api/driver/online-status
  // ─────────────────────────────────────────────────────────────────────────────

  async toggleOnlineStatus(sessionData: UserSessionType) {
    const { user } = sessionData;
    const profile = await this.resolveProfile(user.id);

    const newStatus = !profile.isOnline;

    await this.driverProfileCoreService.update({
      where: { id: profile.id },
      data: { isOnline: newStatus },
    });

    return {
      isOnline: newStatus,
      message: newStatus ? "You're Online" : "You're Offline",
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PUT /api/driver/settings
  // ─────────────────────────────────────────────────────────────────────────────

  async updateSettings(
    sessionData: UserSessionType,
    dto: UpdateDriverSettingsDto,
  ) {
    const { user } = sessionData;
    const profile = await this.resolveProfile(user.id);

    // Build update payload — only write fields that were explicitly sent
    const updateData: Record<string, any> = {};

    if (dto.pushNotifications !== undefined) {
      updateData.pushNotifications = dto.pushNotifications;

      // When push notifications are toggled ON, persist the FCM token if provided
      if (dto.pushNotifications && dto.fcmToken) {
        updateData.fcmToken = dto.fcmToken;
      }

      // When toggled OFF, clear the stored token so notifications stop
      if (!dto.pushNotifications) {
        updateData.fcmToken = null;
      }
    }

    if (dto.locationSharing !== undefined) {
      updateData.locationSharing = dto.locationSharing;
    }

    if (dto.doNotDisturb !== undefined) {
      updateData.doNotDisturb = dto.doNotDisturb;
    }

    const updated = await this.driverProfileCoreService.update({
      where: { id: profile.id },
      data: updateData,
    });

    return {
      message: DriverMessages.SETTINGS_UPDATED,
      settings: {
        pushNotifications: updated.pushNotifications,
        locationSharing: updated.locationSharing,
        doNotDisturb: updated.doNotDisturb,
      },
    };
  }
}
