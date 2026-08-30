import { Module } from '@nestjs/common';
import { UserCoreService } from './user-core.service';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [UserCoreService, PrismaService],
  exports: [UserCoreService],
})
export class UserCoreModule {}
