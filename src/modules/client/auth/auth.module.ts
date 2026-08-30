import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserLoginJwtStrategy } from './strategies/user-login-jwt.strategy';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { UserCoreModule } from 'src/core/user-core/user-core.module';
import { UserSessionCoreModule } from 'src/core/user-session-core/user-session-core.module';

@Module({
  imports: [
    UserCoreModule,
    UserSessionCoreModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as JwtSignOptions['expiresIn'],
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserLoginJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
