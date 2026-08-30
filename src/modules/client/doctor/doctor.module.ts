import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { DoctorCoreModule } from '../../../core/doctor-core/doctor-core.module';
import { DoctorAvailabilityCoreModule } from '../../../core/doctor-availability-core/doctor-availability-core.module';
import { AppointmentCoreModule } from '../../../core/appointment-core/appointment-core.module';

@Module({
  imports: [DoctorCoreModule, DoctorAvailabilityCoreModule, AppointmentCoreModule],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
