import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginType, Status, UserType } from '@prisma/client';
import admin from 'firebase-admin';
import { verifyFirebaseToken } from 'src/shared/libs/firebase-auth';
import { UserSessionCoreService } from 'src/core/user-session-core';
import { UserSessionType } from 'src/shared/types';
import { AuthMessages, UserMessages } from 'src/shared/keys';
import { UserCoreService } from 'src/core/user-core/user-core.service';
import { DriverProfileCoreService } from 'src/core/driver-profile-core/driver-profile-core.service';
import { DriverLoginDto } from './dto/driver-create.dto';

@Injectable()
export class DriverAuthService {
  private readonly logger = new Logger(DriverAuthService.name);

  constructor(
    private userCoreService: UserCoreService,
    private userSessionCoreService: UserSessionCoreService,
    private driverProfileCoreService: DriverProfileCoreService,
  ) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // PUBLIC: login
  // App handles Firebase Phone Auth OTP on its side. Once verified, the app
  // sends the Firebase ID token here. We validate it, then:
  //   - If driver exists  → update firebaseUId + create session
  //   - If driver is new  → create User + DriverProfile + create session
  // ─────────────────────────────────────────────────────────────────────────────

  async login(userLoginDto: DriverLoginDto, headers: any) {
    try {
      const decodedToken = await this.validateTokenWithFirebase(headers);

      const mobile = this.normalizeMobile(decodedToken.phone_number);

      let user = await this.userCoreService.findFirst({
        where: {
          mobile,
          isDeleted: false,
        },
      });

      if (!user) {
        // ── First login: create User record ──────────────────────────────────
        user = await this.userCoreService.create({
          data: {
            mobile,
            userName: userLoginDto.userName || decodedToken.name || null,
            firebaseUId: decodedToken.uid,
            loginType: LoginType.PHONE,
            userType: UserType.DRIVER,
            status: Status.ENABLED,
          },
        });

        // ── Auto-create DriverProfile so profile APIs work immediately ───────
        const driverPartnerId = await this.generateDriverPartnerId();
        await this.driverProfileCoreService.create({
          data: {
            userId: user.id,
            driverPartnerId,
            fullName: userLoginDto.userName || decodedToken.name || null,
          },
        });
      } else if (user.status !== Status.ENABLED) {
        throw new BadRequestException(UserMessages.DISABLED);
      } else {
        // ── Returning driver: refresh firebaseUId + optional userName ─────────
        user = await this.userCoreService.update({
          where: { id: user.id },
          data: {
            firebaseUId: decodedToken.uid,
            userName:
              userLoginDto.userName || decodedToken.name || user.userName,
          },
        });
      }

      // ── Create a new session every login ─────────────────────────────────────
      const userSession = await this.userSessionCoreService.create({
        data: {
          notificationToken: userLoginDto.notificationToken,
          userId: user.id,
        },
      });

      return {
        ...user,
        userSession,
      };
    } catch (error) {
      this.logger.error('login failed', error as any);
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(AuthMessages.AUTH_ERROR);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PROTECTED: logout
  // ─────────────────────────────────────────────────────────────────────────────

  async logout(sessionId: string, sessionData: UserSessionType) {
    try {
      const session = await this.userSessionCoreService.findFirst({
        where: {
          id: sessionId,
          userId: sessionData.user.id,
          isDeleted: false,
        },
      });

      if (!session) {
        throw new NotFoundException(UserMessages.SESSION_NOT_FOUND);
      }

      await this.userSessionCoreService.update({
        where: {
          id: session.id,
        },
        data: {
          isDeleted: true,
          status: Status.DISABLED,
        },
      });

      this.logger.log(
        `Driver ${sessionData.user.id} logged out successfully`,
      );

      return {
        response: true,
        message: 'Logout successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // JWT Strategy — called by DriverLoginJwtGuard on every protected request
  // ─────────────────────────────────────────────────────────────────────────────

  async performJWTStrategy(params: {
    request: Request & { headers: { authorization: string } };
  }): Promise<UserSessionType> {
    const { request } = params;

    const firebaseDecodedToken = await this.validateTokenWithFirebase(
      request.headers,
    );

    const user = await this.userCoreService.findUnique({
      where: {
        firebaseUId: firebaseDecodedToken.uid,
      },
    });

    if (!user) {
      throw new UnauthorizedException(AuthMessages.USER_NOT_FOUND);
    }

    if (user.userType !== UserType.DRIVER) {
      throw new ForbiddenException();
    }

    if (user.status !== Status.ENABLED) {
      throw new UnauthorizedException(AuthMessages.USER_NOT_FOUND);
    }

    return {
      user: user,
    };
  }

  //#region PrivateMethod

  private async validateTokenWithFirebase(headers: any) {
    if (!headers.authorization) {
      throw new UnauthorizedException(AuthMessages.AUTH_HEADER_NOT_FOUND);
    }

    const authHeaderValue = headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new UnauthorizedException(AuthMessages.AUTH_HEADER_IS_NOT_BEARER);
    }

    const parts = authHeaderValue.split(' ');

    if (parts.length !== 2) {
      throw new UnauthorizedException(AuthMessages.INVALID_AUTH_HEADER_BEARER);
    }

    const token = parts[1];

    try {
      const decodedToken = await verifyFirebaseToken(token);
      return decodedToken;
    } catch {
      throw new UnauthorizedException(AuthMessages.TOKEN_EXPIRED);
    }
  }

  private normalizeMobile(mobile?: string | null) {
    if (!mobile) {
      throw new BadRequestException(UserMessages.INVALID_MOBILE);
    }

    const normalized = mobile.replace(/\s+/g, '');
    const digitsOnly = normalized.replace(/[^\d+]/g, '');

    if (!digitsOnly) {
      throw new BadRequestException(UserMessages.INVALID_MOBILE);
    }

    if (digitsOnly.startsWith('+')) {
      return digitsOnly;
    }

    if (digitsOnly.length === 10) {
      return `+91${digitsOnly}`;
    }

    if (digitsOnly.length > 10 && digitsOnly.length <= 15) {
      return `+${digitsOnly.replace(/^\+/, '')}`;
    }

    throw new BadRequestException(UserMessages.INVALID_MOBILE);
  }

  /**
   * Generates a unique driverPartnerId in the format DRV-XXXX.
   * Retries until a non-colliding 4-digit suffix is found.
   */
  private async generateDriverPartnerId(): Promise<string> {
    let attempts = 0;
    while (attempts < 20) {
      const suffix = Math.floor(1000 + Math.random() * 9000).toString();
      const candidate = `DRV-${suffix}`;
      const exists = await this.driverProfileCoreService.findFirst({
        where: { driverPartnerId: candidate },
      });
      if (!exists) return candidate;
      attempts++;
    }
    return `DRV-${Date.now().toString().slice(-4)}`;
  }

  //#endregion
}
