import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../../client/auth/auth.service';
import { AdminLoginJwtStrategy } from '../strategies/admin-login-jwt.strategy';

// Reuses the same JWT auth flow as the patient side, but requires the
// resolved user to have userType === ADMIN (see AuthService.performAdminJWTStrategy).
@Injectable()
export class AdminLoginJwtGuard extends AdminLoginJwtStrategy {
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
