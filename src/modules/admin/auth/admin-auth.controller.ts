import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../client/auth/auth.service';
import { LoginDto } from '../../client/auth/dto';

@ApiTags('Admin: Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Admin login with email & password' })
  login(@Body() dto: LoginDto) {
    return this.authService.adminLogin(dto);
  }
}
