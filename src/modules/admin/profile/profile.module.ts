import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UserCoreModule } from '../../../core/user-core/user-core.module';
import { AuthModule } from '../../client/auth/auth.module';

@Module({
  imports: [UserCoreModule, AuthModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
