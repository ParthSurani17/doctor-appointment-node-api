import { BadRequestException, Injectable } from '@nestjs/common';
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
  async create(params: Prisma.AppointmentCreateArgs): Promise<Appointment> {
    try {
      return await super.create(params);
    } catch (error) {
      this.rethrowSlotConflict(error);
    }
  }

  async update(params: Prisma.AppointmentUpdateArgs): Promise<Appointment> {
    try {
      return await super.update(params);
    } catch (error) {
      this.rethrowSlotConflict(error);
    }
  }

  private rethrowSlotConflict(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new BadRequestException(AppointmentMessages.SLOT_NOT_AVAILABLE);
    }
    throw error;
  }

  constructor(public prisma: PrismaService) {
    super(prisma.appointment, {
      NOT_FOUND: AppointmentMessages.NOT_FOUND,
      DELETED: AppointmentMessages.DELETED,
    });
  }
}
