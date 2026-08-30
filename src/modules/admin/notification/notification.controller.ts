import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { AdminLoginJwtGuard } from '../auth/guards/admin-login-jwt.guard';
import { GetUserSession } from '../../../shared/decorators';
import { UserSessionType } from '../../../shared/types';

@ApiTags('Admin: Notification')
@ApiBearerAuth()
@UseGuards(AdminLoginJwtGuard)
@Controller('admin/notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: 'List my (admin) notifications' })
  findAll(@GetUserSession() session: UserSessionType) {
    return this.notificationService.findAll(session.user.id);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all my notifications as read' })
  markAllRead(@GetUserSession() session: UserSessionType) {
    return this.notificationService.markAllRead(session.user.id);
  }
}
