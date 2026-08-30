import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Status, UserType } from '@prisma/client';
import { UserSessionCoreService } from 'src/core/user-session-core';
import { UserCoreService } from 'src/core/user-core/user-core.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto';
import { UserSessionType } from 'src/shared/types';
import { AuthMessages, UserMessages } from 'src/shared/keys';
import { MailService } from 'src/shared/modules/mail/mail.service';

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userCoreService: UserCoreService,
    private userSessionCoreService: UserSessionCoreService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // ─── Register (Patient self-signup) ─────────────────────

  async register(dto: RegisterDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const existing = await this.userCoreService.findFirst({
      where: { email: normalizedEmail, isDeleted: false },
    });

    if (existing) {
      throw new BadRequestException(AuthMessages.EMAIL_EXIST);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // userType is always forced to PATIENT here — this is the public
    // self-signup endpoint, so a client must never be able to grant itself ADMIN.
    // Admin users are created separately (see prisma/seed.ts).
    const user = await this.userCoreService.create({
      data: {
        fullName: dto.fullName,
        email: normalizedEmail,
        phone: dto.phone,
        password: hashedPassword,
        userType: UserType.PATIENT,
      },
    });

    const userSession = await this.userSessionCoreService.create({
      data: {
        notificationToken: dto.notificationToken,
        userId: user.id,
      },
    });

    const accessToken = this.signToken(user.id, user.email, UserType.PATIENT);

    return {
      status: true,
      message: 'Registered successfully',
      accessToken,
      user: this.sanitizeUser(user),
      userSession,
    };
  }

  // ─── Login (Patient) ─────────────────────────────────────

  async login(dto: LoginDto) {
    const user = await this.validateCredentials(dto.email, dto.password);

    if (user.userType !== UserType.PATIENT) {
      throw new ForbiddenException(UserMessages.PATIENT_AUTHORITY_REQUIRED);
    }

    const userSession = await this.userSessionCoreService.create({
      data: {
        notificationToken: dto.notificationToken,
        userId: user.id,
      },
    });

    const accessToken = this.signToken(user.id, user.email, user.userType);

    return {
      status: true,
      message: 'Logged in successfully',
      accessToken,
      user: this.sanitizeUser(user),
      userSession,
    };
  }

  // ─── Login (Admin) ────────────────────────────────────────

  async adminLogin(dto: LoginDto) {
    const user = await this.validateCredentials(dto.email, dto.password);

    if (user.userType !== UserType.ADMIN) {
      throw new ForbiddenException(UserMessages.ADMIN_AUTHORITY_REQUIRED);
    }

    const accessToken = this.signToken(user.id, user.email, user.userType);

    return {
      status: true,
      message: 'Logged in successfully',
      accessToken,
      user: this.sanitizeUser(user),
    };
  }

  // ─── Forgot / Reset password (shared by patient & admin) ──

  async forgotPassword(dto: ForgotPasswordDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.userCoreService.findFirst({
      where: { email: normalizedEmail, isDeleted: false },
    });

    // Always respond with the same message whether or not the account
    // exists, so this endpoint can't be used to enumerate registered emails.
    const genericResponse = {
      status: true,
      message:
        'If an account exists for that email, a password reset link has been sent.',
    };

    if (!user) {
      return genericResponse;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    await this.userCoreService.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: tokenHash,
        passwordResetExpires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const base =
      dto.resetUrlBase ||
      process.env.FRONTEND_RESET_PASSWORD_URL ||
      'http://localhost:5173/reset-password';
    const resetUrl = `${base}${base.includes('?') ? '&' : '?'}token=${rawToken}`;

    await this.mailService.sendPasswordResetEmail({
      to: user.email,
      resetUrl,
      // name: user.fullName,
    });

    return genericResponse;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');

    const user = await this.userCoreService.findFirst({
      where: {
        passwordResetTokenHash: tokenHash,
        isDeleted: false,
      },
    });

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() < Date.now()
    ) {
      throw new BadRequestException(AuthMessages.RESET_TOKEN_INVALID);
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.userCoreService.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetTokenHash: null,
        passwordResetExpires: null,
      },
    });

    return { status: true, message: 'Password reset successfully. You can now log in.' };
  }

  // ─── Logout ───────────────────────────────────────────────

  async logout(sessionId: string, sessionData: UserSessionType) {
    const session = await this.userSessionCoreService.findFirst({
      where: {
        id: sessionId,
        userId: sessionData.user.id,
        isDeleted: false,
      },
    });

    if (!session) {
      throw new NotFoundException(UserMessages.SESSION_NOT_FOUND);
    }

    await this.userSessionCoreService.update({
      where: { id: session.id },
      data: { isDeleted: true },
    });
    this.logger.log(`User ${sessionData.user.id} logged out successfully`);

    return { response: true, message: 'Logout successfully.' };
  }

  // ─── JWT guards (patient / admin) ──────────────────────────

  async performJWTStrategy(params: {
    request: Request & { headers: { authorization: string } };
  }): Promise<UserSessionType> {
    const user = await this.resolveUserFromJwt(params.request.headers);

    if (user.userType !== UserType.PATIENT) {
      throw new ForbiddenException();
    }

    return { user };
  }

  async performAdminJWTStrategy(params: {
    request: Request & { headers: { authorization: string } };
  }): Promise<UserSessionType> {
    const user = await this.resolveUserFromJwt(params.request.headers);

    if (user.userType !== UserType.ADMIN) {
      throw new ForbiddenException(UserMessages.ADMIN_AUTHORITY_REQUIRED);
    }

    return { user };
  }

  //#region PrivateMethod

  private async validateCredentials(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.userCoreService.findFirst({
      where: { email: normalizedEmail, isDeleted: false },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    if (user.status !== Status.ENABLED) {
      throw new ForbiddenException(UserMessages.DISABLED);
    }

    return user;
  }

  private signToken(userId: string, email: string, userType: UserType) {
    return this.jwtService.sign(
      { sub: userId, email, userType },
      {
        secret: process.env.JWT_SECRET || 'dev-secret-change-me',
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as `${number}${
          | 'ms'
          | 's'
          | 'm'
          | 'h'
          | 'd'
          | 'w'
          | 'y'}`,
      },
    );
  }

  private async resolveUserFromJwt(headers: any) {
    if (!headers.authorization) {
      throw new UnauthorizedException(AuthMessages.AUTH_HEADER_NOT_FOUND);
    }

    const authHeaderValue = headers.authorization;
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new UnauthorizedException(AuthMessages.AUTH_HEADER_IS_NOT_BEARER);
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new UnauthorizedException(AuthMessages.INVALID_AUTH_HEADER_BEARER);
    }

    const token = parts[1];

    let payload: { sub: string; email: string; userType: UserType };
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'dev-secret-change-me',
      });
    } catch {
      throw new UnauthorizedException(AuthMessages.TOKEN_EXPIRED);
    }

    const user = await this.userCoreService.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException(AuthMessages.USER_NOT_FOUND);
    }

    if (user.status !== Status.ENABLED) {
      throw new UnauthorizedException(AuthMessages.USER_NOT_FOUND);
    }

    return user;
  }

  private sanitizeUser(user: any) {
    const { password, passwordResetTokenHash, passwordResetExpires, ...rest } = user;
    return rest;
  }

  //#endregion
}
