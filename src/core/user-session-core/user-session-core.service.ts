import { Injectable } from '@nestjs/common';
import { UserSession, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { UserSessionCorePaginateDto } from './dto/user-session-core.dto';
import { UserMessages } from '../../shared/keys/user.keys';

@Injectable()
export class UserSessionCoreService extends PrismaBaseRepository<
  UserSession,
  UserSessionCorePaginateDto,
  Prisma.UserSessionCreateArgs,
  Prisma.UserSessionCreateManyArgs,
  Prisma.UserSessionUpdateArgs,
  Prisma.UserSessionUpdateManyArgs,
  Prisma.UserSessionFindUniqueArgs,
  Prisma.UserSessionFindFirstArgs,
  Prisma.UserSessionFindManyArgs,
  Prisma.UserSessionDeleteArgs,
  Prisma.UserSessionDeleteManyArgs,
  Prisma.UserSessionCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.userSession, {
      NOT_FOUND: UserMessages.NOT_FOUND,
      DELETED: UserMessages.DELETED,
    });
  }
}
