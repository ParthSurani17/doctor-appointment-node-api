import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import express from 'express';
import admin from 'firebase-admin';
import { swaggerLoader } from './shared/swagger';
import { PrismaService } from './shared/modules/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  app.use(helmet());
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  swaggerLoader(app);

  const clientOrigins = configService
    .get<string>('CORS_ORIGIN', 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: clientOrigins,
    credentials: true,
  });

  // Firebase is OPTIONAL in this project — the main auth flow (patient
  // register/login, admin login, forgot/reset password) uses our own
  // JWT + bcrypt, not Firebase. Firebase is only kept in reserve for a
  // possible future Google/Apple sign-in addition, so we don't want a
  // missing service-account file to crash the whole app on boot.
  const serviceAccountPath = path.join(
    __dirname,
    '..',
    'resource',
    'serviceAccountKey.json',
  );

  if (fs.existsSync(serviceAccountPath)) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
      // eslint-disable-next-line no-console
      console.log('Firebase Admin initialized.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        `Firebase Admin failed to initialize (continuing without it): ${err.message}`,
      );
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      'resource/serviceAccountKey.json not found — skipping Firebase Admin init. ' +
        'This is fine: the app does not require Firebase for auth (see README).',
    );
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`http://localhost:${port}/api/`);
}
bootstrap();
