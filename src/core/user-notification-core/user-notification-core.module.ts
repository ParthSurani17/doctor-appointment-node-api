import { Module } from '@nestjs/common';
import { UserNotificationCoreService } from './user-notification-core.service';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [UserNotificationCoreService, PrismaService],
  exports: [UserNotificationCoreService],
})
export class UserNotificationCoreModule {}
