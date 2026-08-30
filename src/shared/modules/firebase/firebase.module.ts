import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import firebaseConfig from './firebase.config';
// import { FirebaseService } from './firebase.service';
// import { UserCoreModule } from '../../../core/user-core/user-core.module';
// import { NotificationCoreModule } from '../../../core/notification-core';
// import { UserSessionCoreModule } from '../../../core/user-session-core/user-session-core.module';

@Module({
  imports: [
    ConfigModule.forFeature(firebaseConfig),
    // UserSessionCoreModule,
    // UserCoreModule,
    // NotificationCoreModule,
  ],
//   providers: [FirebaseService],
//   exports: [FirebaseService],
})
export class FirebaseModule {}
