import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UserCoreModule } from '../../../core/user-core/user-core.module';
import { DoctorCoreModule } from '../../../core/doctor-core/doctor-core.module';
import { AppointmentCoreModule } from '../../../core/appointment-core/appointment-core.module';
import { AuthModule } from '../../client/auth/auth.module';

@Module({
  imports: [UserCoreModule, DoctorCoreModule, AppointmentCoreModule, AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
