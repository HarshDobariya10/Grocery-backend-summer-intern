import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Status, UserType } from '@prisma/client';
import admin from 'firebase-admin';
import { verifyFirebaseToken } from 'src/shared/libs/firebase-auth';
import { UserSessionCoreService } from 'src/core/user-session-core';
import { AuthMessages, UserMessages } from 'src/shared/keys';
import { UserCoreService } from 'src/core/user-core/user-core.service';
import {
  AdminLoginDto,
  AdminCreateDto,
} from './dto/admin-auth.dto';
import { UserSessionType } from 'src/shared/types';

@Injectable()
export class AdminAuthService {
  private readonly logger = new Logger(AdminAuthService.name);

  constructor(
    private userCoreService: UserCoreService,
    private userSessionCoreService: UserSessionCoreService,
  ) {}

  async signup(adminCreateDto: AdminCreateDto, headers: any) {
    try {
      const firebaseDecodedToken =
        await this.validateTokenWithFirebase(headers);

      const existingUser = await this.userCoreService.findFirst({
        where: {
          firebaseUId: firebaseDecodedToken.uid,
          isDeleted: false,
        },
      });

      if (existingUser) {
        throw new BadRequestException(UserMessages.ALREADY_EXISTS);
      }

      if (firebaseDecodedToken?.email) {
        const existingEmailUser = await this.userCoreService.findFirst({
          where: {
            email: firebaseDecodedToken.email,
            isDeleted: false,
          },
        });

        if (existingEmailUser) {
          throw new BadRequestException(AuthMessages.EMAIL_EXIST);
        }
      }

      const user = await this.userCoreService.create({
        data: {
          email: firebaseDecodedToken?.email || null,
          firebaseUId: firebaseDecodedToken.uid,
          userType: UserType.ADMIN,
          loginType: adminCreateDto.loginType,
        }as any,
      });

      const userSession = await this.userSessionCoreService.create({
        data: {
          notificationToken: adminCreateDto.notificationToken,
          userId: user.id,
        },
      });

      return {
        ...user,
        userSession,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(AuthMessages.AUTH_ERROR);
    }
  }

  async login(adminLoginDto: AdminLoginDto, headers: any) {
    try {
      const firebaseDecodedToken =
        await this.validateTokenWithFirebase(headers);

      const user = await this.userCoreService.findFirst({
        where: {
          firebaseUId: firebaseDecodedToken.uid,
          isDeleted: false,
          userType: UserType.ADMIN,
        },
      });

      if (!user) {
        throw new BadRequestException(AuthMessages.ADMIN_NOT_FOUND);
      }

      if (user.status !== Status.ENABLED) {
        throw new BadRequestException(UserMessages.DISABLED);
      }

      const userSession = await this.userSessionCoreService.create({
        data: {
          notificationToken: adminLoginDto.notificationToken,
          userId: user.id,
        },
      });

      return {
        ...user,
        userSession,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
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
        },
      });

      this.logger.log(`Admin ${sessionData.user.id} logged out successfully`);

      return {
        response: true,
        message: 'Logout successfully.',
      };
    } catch (error) {
      throw error;
    }
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

    if (user.userType !== UserType.ADMIN) {
      throw new ForbiddenException();
    }

    if (user.status !== Status.ENABLED) {
      throw new UnauthorizedException(AuthMessages.USER_NOT_FOUND);
    }

    return {
      user: user,
    };
  }

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
