import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { BaseQueryCoreService } from './base-query-core.service';

@Module({
  providers: [PrismaService, BaseQueryCoreService],
  exports: [BaseQueryCoreService],
})
export class BaseQueryCoreModule {}
