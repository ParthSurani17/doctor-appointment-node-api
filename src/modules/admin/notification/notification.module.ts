import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { UserNotificationCoreModule } from '../../../core/user-notification-core/user-notification-core.module';
import { AuthModule } from '../../client/auth/auth.module';

@Module({
  imports: [UserNotificationCoreModule, AuthModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
