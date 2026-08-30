import { Module } from '@nestjs/common';
import { NotificationCoreService } from './notification-core.service';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [NotificationCoreService, PrismaService],
  exports: [NotificationCoreService],
})
export class NotificationCoreModule {}
