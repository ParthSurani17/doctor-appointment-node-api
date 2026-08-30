import { Injectable } from '@nestjs/common';
import { Appointment, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { AppointmentCorePaginateDto } from './dto/appointment-core.dto';
import { AppointmentMessages } from '../../shared/keys/appointment.keys';

@Injectable()
export class AppointmentCoreService extends PrismaBaseRepository<
  Appointment,
  AppointmentCorePaginateDto,
  Prisma.AppointmentCreateArgs,
  Prisma.AppointmentCreateManyArgs,
  Prisma.AppointmentUpdateArgs,
  Prisma.AppointmentUpdateManyArgs,
  Prisma.AppointmentFindUniqueArgs,
  Prisma.AppointmentFindFirstArgs,
  Prisma.AppointmentFindManyArgs,
  Prisma.AppointmentDeleteArgs,
  Prisma.AppointmentDeleteManyArgs,
  Prisma.AppointmentCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.appointment, {
      NOT_FOUND: AppointmentMessages.NOT_FOUND,
      DELETED: AppointmentMessages.DELETED,
    });
  }
}
