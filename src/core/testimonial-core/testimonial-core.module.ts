import { Module } from '@nestjs/common';
import { TestimonialCoreService } from './testimonial-core.service';
import { PrismaService } from '../../shared/modules/prisma/prisma.service';

@Module({
  imports: [],
  providers: [TestimonialCoreService, PrismaService],
  exports: [TestimonialCoreService],
})
export class TestimonialCoreModule {}
