import { Module } from '@nestjs/common';
import { DepartmentModule } from './department/department.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PatientModule } from './patient/patient.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminAuthModule } from './auth/admin-auth.module';
import { ProfileModule } from './profile/profile.module';
import { TestimonialModule } from './testimonial/testimonial.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    AdminAuthModule,
    ProfileModule,
    DepartmentModule,
    DoctorModule,
    AppointmentModule,
    PatientModule,
    DashboardModule,
    TestimonialModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {}
