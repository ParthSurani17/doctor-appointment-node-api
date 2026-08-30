import { Module } from '@nestjs/common';
import { UserCoreModule } from '../../../core/user-core/user-core.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BaseQueryCoreModule } from '../../../core/base-query-core/base-query-core.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    UserCoreModule,
    BaseQueryCoreModule,
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
