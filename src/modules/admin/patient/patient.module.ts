import { Module } from '@nestjs/common';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { UserCoreModule } from '../../../core/user-core/user-core.module';
import { AuthModule } from '../../client/auth/auth.module';

@Module({
  imports: [UserCoreModule, AuthModule],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
