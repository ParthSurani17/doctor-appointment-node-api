import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { ClientModule } from './modules/client/client.module';
import { PrismaService } from './shared/modules/prisma/prisma.service';
import { MailModule } from './shared/modules/mail/mail.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailModule,
    ClientModule,
    AdminModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
