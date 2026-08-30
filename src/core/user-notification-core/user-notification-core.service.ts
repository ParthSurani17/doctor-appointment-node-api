import { Injectable } from '@nestjs/common';
import { UserNotification, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { UserNotificationCorePaginateDto } from './dto/user-notification-core.dto';
import { NotificationMessages } from '../../shared/keys/appointment.keys';

@Injectable()
export class UserNotificationCoreService extends PrismaBaseRepository<
  UserNotification,
  UserNotificationCorePaginateDto,
  Prisma.UserNotificationCreateArgs,
  Prisma.UserNotificationCreateManyArgs,
  Prisma.UserNotificationUpdateArgs,
  Prisma.UserNotificationUpdateManyArgs,
  Prisma.UserNotificationFindUniqueArgs,
  Prisma.UserNotificationFindFirstArgs,
  Prisma.UserNotificationFindManyArgs,
  Prisma.UserNotificationDeleteArgs,
  Prisma.UserNotificationDeleteManyArgs,
  Prisma.UserNotificationCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.userNotification, {
      NOT_FOUND: NotificationMessages.NOT_FOUND,
      DELETED: NotificationMessages.DELETED,
    });
  }

  async updateMany(params: Prisma.UserNotificationUpdateManyArgs) {
    return this.prisma.userNotification.updateMany(params);
  }
}
