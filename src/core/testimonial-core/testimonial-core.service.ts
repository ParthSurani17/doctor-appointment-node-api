import { Injectable } from '@nestjs/common';
import { Testimonial, Prisma } from '@prisma/client';
import { PrismaBaseRepository } from '../../shared/libs/prisma-base.repository';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';
import { TestimonialCorePaginateDto } from './dto/testimonial-core.dto';
import { TestimonialMessages } from '../../shared/keys/appointment.keys';

@Injectable()
export class TestimonialCoreService extends PrismaBaseRepository<
  Testimonial,
  TestimonialCorePaginateDto,
  Prisma.TestimonialCreateArgs,
  Prisma.TestimonialCreateManyArgs,
  Prisma.TestimonialUpdateArgs,
  Prisma.TestimonialUpdateManyArgs,
  Prisma.TestimonialFindUniqueArgs,
  Prisma.TestimonialFindFirstArgs,
  Prisma.TestimonialFindManyArgs,
  Prisma.TestimonialDeleteArgs,
  Prisma.TestimonialDeleteManyArgs,
  Prisma.TestimonialCountArgs
> {
  constructor(public prisma: PrismaService) {
    super(prisma.testimonial, {
      NOT_FOUND: TestimonialMessages.NOT_FOUND,
      DELETED: TestimonialMessages.DELETED,
    });
  }
}
