import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { UserCorePaginateDto } from './dto/user-core.dto';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { UserMessages } from '../../shared/keys/user.keys';

@Injectable()
export class UserCoreService extends PrismaBaseRepository<
  User,
  UserCorePaginateDto,
  Prisma.UserCreateArgs,
  Prisma.UserCreateManyArgs,
  Prisma.UserUpdateArgs,
  Prisma.UserUpdateManyArgs,
  Prisma.UserFindUniqueArgs,
  Prisma.UserFindFirstArgs,
  Prisma.UserFindManyArgs,
  Prisma.UserDeleteArgs,
  Prisma.UserDeleteManyArgs,
  Prisma.UserCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.user, {
      NOT_FOUND: UserMessages.NOT_FOUND,
      DELETED: UserMessages.DELETED,
    });
  }
}
