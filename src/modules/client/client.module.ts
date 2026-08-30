import { Module } from '@nestjs/common';
import { UploadModule } from '../../shared/modules/upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentModule } from './department/department.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';

@Module({
  imports: [
    UploadModule,
    AuthModule,
    DepartmentModule,
    DoctorModule,
    AppointmentModule,
  ],
  controllers: [],
  providers: [],
})
export class ClientModule {}
