import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { UserSessionCoreService } from './user-session-core.service';

@Module({
  imports: [],
  providers: [UserSessionCoreService, PrismaService],
  exports: [UserSessionCoreService],
})
export class UserSessionCoreModule {}
