import { Injectable } from '@nestjs/common';
import { Department, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { DepartmentCorePaginateDto } from './dto/department-core.dto';
import { DepartmentMessages } from '../../shared/keys/appointment.keys';

@Injectable()
export class DepartmentCoreService extends PrismaBaseRepository<
  Department,
  DepartmentCorePaginateDto,
  Prisma.DepartmentCreateArgs,
  Prisma.DepartmentCreateManyArgs,
  Prisma.DepartmentUpdateArgs,
  Prisma.DepartmentUpdateManyArgs,
  Prisma.DepartmentFindUniqueArgs,
  Prisma.DepartmentFindFirstArgs,
  Prisma.DepartmentFindManyArgs,
  Prisma.DepartmentDeleteArgs,
  Prisma.DepartmentDeleteManyArgs,
  Prisma.DepartmentCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.department, {
      NOT_FOUND: DepartmentMessages.NOT_FOUND,
      DELETED: DepartmentMessages.DELETED,
    });
  }
}
