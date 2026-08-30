import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { DepartmentCoreModule } from '../../../core/department-core/department-core.module';
import { DoctorCoreModule } from '../../../core/doctor-core/doctor-core.module';
import { AuthModule } from '../../client/auth/auth.module';

@Module({
  imports: [DepartmentCoreModule, DoctorCoreModule, AuthModule],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
