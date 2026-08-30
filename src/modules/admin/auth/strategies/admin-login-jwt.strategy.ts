import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../client/auth/auth.service';

@Injectable()
export class AdminLoginJwtStrategy {
  constructor(private readonly authService: AuthService) {}

  async validate(request: Request & { headers: { authorization: string } }) {
    return this.authService.performAdminJWTStrategy({
      request,
    });
  }
}
