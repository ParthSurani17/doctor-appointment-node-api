import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { UserLoginJwtStrategy } from '../strategies/user-login-jwt.strategy';

@Injectable()
export class UserLoginJwtGuard extends UserLoginJwtStrategy {
  constructor(
    private readonly reflector: Reflector,
    authService: AuthService,
  ) {
    super(authService);
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    return super.validate(context.switchToHttp().getRequest());
  }
}
