import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { DoctorCoreModule } from '../../../core/doctor-core/doctor-core.module';
import { DoctorAvailabilityCoreModule } from '../../../core/doctor-availability-core/doctor-availability-core.module';
import { DepartmentCoreModule } from '../../../core/department-core/department-core.module';
import { AuthModule } from '../../client/auth/auth.module';
import { UploadModule } from '../../../shared/modules/upload/upload.module';

@Module({
  imports: [
    DoctorCoreModule,
    DoctorAvailabilityCoreModule,
    DepartmentCoreModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
