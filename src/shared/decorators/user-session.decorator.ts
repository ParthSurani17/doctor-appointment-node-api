import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSessionType } from '../types/user-session.type';

import * as jwt from 'jsonwebtoken';
import { AuthMessages } from '../keys/user.keys';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

// Verifies our own JWT (issued by AuthService.signToken on
// register/login) and resolves the request.user from it — this must stay
// in sync with AuthService's token format (payload.sub = user id).
export const GetUserSession = createParamDecorator(
  async (data: any, ctx: ExecutionContext): Promise<UserSessionType> => {
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

    let payload: { sub: string };
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'dev-secret-change-me',
      ) as { sub: string };
    } catch {
      throw new UnauthorizedException(AuthMessages.TOKEN_EXPIRED);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
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
  },
);

export const GetUserRequestHeader = createParamDecorator(
  (data: any, ctx: ExecutionContext): UserSessionType => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers;
  },
);
