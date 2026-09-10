import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { UserLoginJwtGuard } from '../auth/guards/user-login-jwt.guard';
import { GetUserSession } from '../../../shared/decorators';
import { UserSessionType } from '../../../shared/types';
import { UpdateProfileDto } from '../auth/dto';

@ApiTags('Client: User')
@ApiBearerAuth()
@UseGuards(UserLoginJwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'To get all user' })
  async getAllUsers(@Query() baseQueryCoreDto: BaseQueryCoreDto) {
    return await this.userService.getAllUsers({
      baseQueryCoreDto,
    });
  }

  @Get('me')
  @ApiOperation({ summary: 'Get my own profile' })
  async getMe(@GetUserSession() session: UserSessionType) {
    return this.userService.getMe(session.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update my own profile' })
  async updateMe(
    @GetUserSession() session: UserSessionType,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateMe(session.user.id, dto);
  }

  @Get('me/notifications')
  @ApiOperation({ summary: 'List my notifications' })
  async getMyNotifications(@GetUserSession() session: UserSessionType) {
    return this.userService.getMyNotifications(session.user.id);
  }

  @Patch('me/notifications/read-all')
  @ApiOperation({ summary: 'Mark all my notifications as read' })
  async markMyNotificationsRead(@GetUserSession() session: UserSessionType) {
    return this.userService.markMyNotificationsRead(session.user.id);
  }
}
