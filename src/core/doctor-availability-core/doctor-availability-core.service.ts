import { Injectable } from '@nestjs/common';
import { DoctorAvailability, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { DoctorAvailabilityCorePaginateDto } from './dto/doctor-availability-core.dto';
import { DoctorAvailabilityMessages } from '../../shared/keys/appointment.keys';

@Injectable()
export class DoctorAvailabilityCoreService extends PrismaBaseRepository<
  DoctorAvailability,
  DoctorAvailabilityCorePaginateDto,
  Prisma.DoctorAvailabilityCreateArgs,
  Prisma.DoctorAvailabilityCreateManyArgs,
  Prisma.DoctorAvailabilityUpdateArgs,
  Prisma.DoctorAvailabilityUpdateManyArgs,
  Prisma.DoctorAvailabilityFindUniqueArgs,
  Prisma.DoctorAvailabilityFindFirstArgs,
  Prisma.DoctorAvailabilityFindManyArgs,
  Prisma.DoctorAvailabilityDeleteArgs,
  Prisma.DoctorAvailabilityDeleteManyArgs,
  Prisma.DoctorAvailabilityCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.doctorAvailability, {
      NOT_FOUND: DoctorAvailabilityMessages.NOT_FOUND,
      DELETED: DoctorAvailabilityMessages.DELETED,
    });
  }
}
