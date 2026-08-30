import { Module } from '@nestjs/common';
import { AppointmentCoreService } from './appointment-core.service';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [AppointmentCoreService, PrismaService],
  exports: [AppointmentCoreService],
})
export class AppointmentCoreModule {}
