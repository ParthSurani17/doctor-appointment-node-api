import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto';
import { GetUserSession } from 'src/shared/decorators';
import { UserSessionType } from 'src/shared/types';

@ApiTags('Auth (Patient)')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Patient self-signup with email & password' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Patient login with email & password' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset email (patient or admin)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using the token from the reset email' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Post(':sessionId/logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  async logout(
    @Param('sessionId') sessionId: string,
    @GetUserSession() sessionData: UserSessionType,
  ) {
    return this.authService.logout(sessionId, sessionData);
  }
}
