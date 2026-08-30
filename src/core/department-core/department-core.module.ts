import { Module } from '@nestjs/common';
import { DepartmentCoreService } from './department-core.service';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [DepartmentCoreService, PrismaService],
  exports: [DepartmentCoreService],
})
export class DepartmentCoreModule {}
