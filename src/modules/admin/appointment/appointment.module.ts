import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentCoreModule } from '../../../core/appointment-core/appointment-core.module';
import { DoctorCoreModule } from '../../../core/doctor-core/doctor-core.module';
import { DoctorAvailabilityCoreModule } from '../../../core/doctor-availability-core/doctor-availability-core.module';
import { UserCoreModule } from '../../../core/user-core/user-core.module';
import { AuthModule } from '../../client/auth/auth.module';

@Module({
  imports: [
    AppointmentCoreModule,
    DoctorCoreModule,
    DoctorAvailabilityCoreModule,
    UserCoreModule,
    AuthModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
