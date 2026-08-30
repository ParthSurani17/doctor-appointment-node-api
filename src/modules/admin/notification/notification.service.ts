import { Injectable } from '@nestjs/common';
import { UserNotificationCoreService } from '../../../core/user-notification-core';

@Injectable()
export class NotificationService {
  constructor(private userNotificationCoreService: UserNotificationCoreService) {}

  async findAll(adminUserId: string) {
    return this.userNotificationCoreService.findMany({
      where: { userId: adminUserId },
      include: { notification: true },
      orderBy: { createdAt: 'desc' },
    } as any);
  }

  async markAllRead(adminUserId: string) {
    await this.userNotificationCoreService.updateMany({
      where: { userId: adminUserId, isRead: false },
      data: { isRead: true },
    });
    return { status: true, message: 'All notifications marked as read.' };
  }
}
