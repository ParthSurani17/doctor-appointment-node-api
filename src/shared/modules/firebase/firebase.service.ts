/* eslint-disable no-console */
import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
// import { FirebasePayload } from '../../../shared/types/notifications.type';
// import { NotificationCoreService } from '../../../core/notification-core';
import { UserSessionCoreService } from '../../../core/user-session-core';
import { UserCoreService } from '../../../core/user-core/user-core.service';

@Injectable()
export class FirebaseService {
  constructor(
    private userCoreService: UserCoreService,
    private userSessionCoreService: UserSessionCoreService,
    // private notificationCoreService: NotificationCoreService,
  ) {}

//   async sendFirebaseMessage({
//     senderId,
//     receiverId,
//     title,
//     message,
//     notificationType,
//     content,
//     dynamicData = {},
//   }: FirebasePayload) {
//     const user = await this.userCoreService.findFirst({
//       where: {
//         id: receiverId,
//         isDeleted: false,
//       },
//     });

//     if (!user) {
//       // If the user doesn't exist or is deleted, return without doing anything
//       return;
//     }

//     const userSessions = await this.userSessionCoreService.findMany({
//       where: {
//         userId: user.id,
//         isDeleted: false,
//       },
//     });

//     // Extract and filter valid device tokens
//     let deviceTokens = userSessions?.map(
//       (session: any) => session.notificationToken,
//     );
//     deviceTokens = deviceTokens?.filter(
//       (fcmToken: any) => fcmToken && fcmToken !== 'null',
//     );

//     if (deviceTokens.length === 0) {
//       return;
//     }

//     // Store the notification in the database
//     const sendNotificationInDb = await this.notificationCoreService.create({
//       data: {
//         receiverId: receiverId,
//         senderId: senderId,
//         notificationType: notificationType,
//         title: title,
//         body: message,
//         content: content,
//       },
//     });

//     dynamicData.data = dynamicData.data || {};
//     const data = JSON.stringify(sendNotificationInDb);

//     const messagePayload = {
//       data: {
//         data,
//       },
//       notification: {
//         title,
//         body: message,
//         // sound: 'default',
//       },
//     };

//     console.log('Message Payload:', messagePayload);
//     console.log('Device Token:', deviceTokens);

//     try {
//     // Create an array of promises
//     const promises = deviceTokens.map((token: any) => {
//       return admin.messaging().send({
//         token,
//         ...messagePayload,
//       });
//     });

//     // Wait for all promises to resolve (sends notifications in parallel)
//     const results = await Promise.all(promises);

//     console.log('All messages sent successfully:', results);
//     } catch (error) {
//       console.error('Error sending messages:', error);
//     }

//     return sendNotificationInDb;
//   }
}
