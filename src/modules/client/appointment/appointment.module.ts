import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentCoreModule } from '../../../core/appointment-core/appointment-core.module';
import { DoctorCoreModule } from '../../../core/doctor-core/doctor-core.module';
import { DoctorAvailabilityCoreModule } from '../../../core/doctor-availability-core/doctor-availability-core.module';
import { DepartmentCoreModule } from '../../../core/department-core/department-core.module';
import { UserCoreModule } from '../../../core/user-core/user-core.module';
import { NotificationCoreModule } from '../../../core/notification-core/notification-core.module';
import { UserNotificationCoreModule } from '../../../core/user-notification-core/user-notification-core.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AppointmentCoreModule,
    DoctorCoreModule,
    DoctorAvailabilityCoreModule,
    DepartmentCoreModule,
    UserCoreModule,
    NotificationCoreModule,
    UserNotificationCoreModule,
    AuthModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
