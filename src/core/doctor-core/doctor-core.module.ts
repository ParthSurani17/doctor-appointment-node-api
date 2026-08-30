import { Module } from '@nestjs/common';
import { DoctorCoreService } from './doctor-core.service';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [DoctorCoreService, PrismaService],
  exports: [DoctorCoreService],
})
export class DoctorCoreModule {}
