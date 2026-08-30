import { Injectable } from '@nestjs/common';
import { Notification, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { NotificationCorePaginateDto } from './dto/notification-core.dto';
import { NotificationMessages } from '../../shared/keys/appointment.keys';

@Injectable()
export class NotificationCoreService extends PrismaBaseRepository<
  Notification,
  NotificationCorePaginateDto,
  Prisma.NotificationCreateArgs,
  Prisma.NotificationCreateManyArgs,
  Prisma.NotificationUpdateArgs,
  Prisma.NotificationUpdateManyArgs,
  Prisma.NotificationFindUniqueArgs,
  Prisma.NotificationFindFirstArgs,
  Prisma.NotificationFindManyArgs,
  Prisma.NotificationDeleteArgs,
  Prisma.NotificationDeleteManyArgs,
  Prisma.NotificationCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.notification, {
      NOT_FOUND: NotificationMessages.NOT_FOUND,
      DELETED: NotificationMessages.DELETED,
    });
  }
}
