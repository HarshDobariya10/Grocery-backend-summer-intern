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
import { UserLoginDto } from './dto/user-create.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userCoreService: UserCoreService,
    private userSessionCoreService: UserSessionCoreService,
  ) {}

  async verifyOtp(userLoginDto: UserLoginDto, headers: any) {
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
        user = await this.userCoreService.create({
          data: {
            mobile,
            userName: userLoginDto.userName || decodedToken.name || null,
            firebaseUId: decodedToken.uid,
            loginType: LoginType.PHONE,
            userType: UserType.CUSTOMER,
            status: Status.ENABLED,
          },
        });
      } else if (user.status !== Status.ENABLED) {
        throw new BadRequestException(UserMessages.DISABLED);
      } else {
        user = await this.userCoreService.update({
          where: { id: user.id },
          data: {
            firebaseUId: decodedToken.uid,
            userName:
              userLoginDto.userName || decodedToken.name || user.userName,
          },
        });
      }

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
      this.logger.error('verifyOtp failed', error as any);
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException(AuthMessages.AUTH_ERROR);
    }
  }

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
        `Customer ${sessionData.user.id} logged out successfully`,
      );

      return {
        response: true,
        message: 'Logout successfully.',
      };
    } catch (error) {
      throw error;
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

    if (user.userType !== UserType.CUSTOMER) {
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
}
