import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserCoreService } from '../../../core/user-core/user-core.service';
import { AdminLoginJwtGuard } from '../auth/guards/admin-login-jwt.guard';
import { GetUserSession } from '../../../shared/decorators';
import { UserSessionType } from '../../../shared/types';
import { UpdateProfileDto } from '../../client/auth/dto';

@ApiTags('Admin: Profile')
@ApiBearerAuth()
@UseGuards(AdminLoginJwtGuard)
@Controller('admin/profile')
export class ProfileController {
  constructor(private userCoreService: UserCoreService) {}

  @Get()
  @ApiOperation({ summary: 'Get my (admin) profile' })
  async getMe(@GetUserSession() session: UserSessionType) {
    const { password, passwordResetTokenHash, passwordResetExpires, ...safe } =
      session.user as any;
    return safe;
  }

  @Patch()
  @ApiOperation({ summary: 'Update my (admin) profile' })
  async updateMe(
    @GetUserSession() session: UserSessionType,
    @Body() dto: UpdateProfileDto,
  ) {
    const user = await this.userCoreService.update({
      where: { id: session.user.id },
      data: dto,
    });
    const { password, passwordResetTokenHash, passwordResetExpires, ...safe } = user as any;
    return safe;
  }
}
