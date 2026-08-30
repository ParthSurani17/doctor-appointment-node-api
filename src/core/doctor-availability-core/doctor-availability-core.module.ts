import { Module } from '@nestjs/common';
import { DoctorAvailabilityCoreService } from './doctor-availability-core.service';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [DoctorAvailabilityCoreService, PrismaService],
  exports: [DoctorAvailabilityCoreService],
})
export class DoctorAvailabilityCoreModule {}
