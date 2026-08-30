import { Injectable } from '@nestjs/common';
import { Doctor, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { DoctorCorePaginateDto } from './dto/doctor-core.dto';
import { DoctorMessages } from '../../shared/keys/appointment.keys';

@Injectable()
export class DoctorCoreService extends PrismaBaseRepository<
  Doctor,
  DoctorCorePaginateDto,
  Prisma.DoctorCreateArgs,
  Prisma.DoctorCreateManyArgs,
  Prisma.DoctorUpdateArgs,
  Prisma.DoctorUpdateManyArgs,
  Prisma.DoctorFindUniqueArgs,
  Prisma.DoctorFindFirstArgs,
  Prisma.DoctorFindManyArgs,
  Prisma.DoctorDeleteArgs,
  Prisma.DoctorDeleteManyArgs,
  Prisma.DoctorCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.doctor, {
      NOT_FOUND: DoctorMessages.NOT_FOUND,
      DELETED: DoctorMessages.DELETED,
    });
  }
}
