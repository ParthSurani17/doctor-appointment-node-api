import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto/base-query-core.dto';
import { UserCoreService } from '../../../core/user-core/user-core.service';
import { UserMessages } from '../../../shared/keys/user.keys';

import { BaseQueryCoreService } from '../../../core/base-query-core';
import { UserType } from '@prisma/client';
import { UserNotificationCoreService } from '../../../core/user-notification-core';

@Injectable()
export class UserService {
  constructor(
    private userCoreService: UserCoreService,
    private userNotificationCoreService: UserNotificationCoreService,
  ) {}
  /**
   * Get all users
   * @param param
   * @returns
   */
  async getAllUsers(param: { baseQueryCoreDto: BaseQueryCoreDto }) {
    const { baseQueryCoreDto } = param;

    const whereQuery = {
      isDeleted: false,
      userType: UserType.PATIENT,
    };

    const userList = await this.userCoreService.findPaginate(
      baseQueryCoreDto,
      whereQuery,
    );

    if (!userList) {
      throw new BadRequestException(UserMessages.NOT_FOUND);
    }

    return userList;
  }

  async getMe(userId: string) {
    const user = await this.userCoreService.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException(UserMessages.NOT_FOUND);
    }
    const { password, passwordResetTokenHash, passwordResetExpires, ...safe } = user as any;
    return safe;
  }

  async updateMe(userId: string, data: { fullName?: string; phone?: string; profilePic?: string }) {
    const user = await this.userCoreService.update({ where: { id: userId }, data });
    const { password, passwordResetTokenHash, passwordResetExpires, ...safe } = user as any;
    return safe;
  }

  async getMyNotifications(userId: string) {
    return this.userNotificationCoreService.findMany({
      where: { userId },
      include: { notification: true },
      orderBy: { createdAt: 'desc' },
    } as any);
  }

  async markMyNotificationsRead(userId: string) {
    await this.userNotificationCoreService.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { status: true, message: 'All notifications marked as read.' };
  }
}
