import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSessionType } from '../types/user-session.type';

import admin from 'firebase-admin';
import { verifyFirebaseToken } from 'src/shared/libs/firebase-auth';
import { AuthMessages } from '../keys/user.keys';
import { PrismaClient, Status } from '@prisma/client';

export const GetUserSession = createParamDecorator(
  async (data: any, ctx: ExecutionContext): Promise<UserSessionType> => {
    if (data) {
      // eslint-disable-next-line no-console
      console.log('data', data);
    }
    const request = ctx.switchToHttp().getRequest();
    const headers = request.headers;

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

      const prisma = new PrismaClient();

      const user = await prisma.user.findUniqueOrThrow({
        where: {
          firebaseUId: decodedToken.uid,
          // isDeleted: false,
        },
      });

      if (!user) {
        throw new UnauthorizedException(AuthMessages.USER_NOT_FOUND);
      }

      if (user.status === Status.DISABLED || user.isDeleted) {
        throw new UnauthorizedException(AuthMessages.USER_NOT_FOUND);
      }

      return {
        user,
      };
    } catch {
      throw new UnauthorizedException(AuthMessages.TOKEN_EXPIRED);
    }
  },
);

export const GetUserRequestHeader = createParamDecorator(
  (data: any, ctx: ExecutionContext): UserSessionType => {
    if (data) {
      // eslint-disable-next-line no-console
      console.log('data', data);
    }
    const request = ctx.switchToHttp().getRequest();
    return request.headers;
  },
);
