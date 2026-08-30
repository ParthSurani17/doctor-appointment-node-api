import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class UserLoginJwtStrategy {
  constructor(private readonly authService: AuthService) {}

  async validate(request: Request & { headers: { authorization: string } }) {
    return this.authService.performJWTStrategy({
      request,
    });
  }
}
