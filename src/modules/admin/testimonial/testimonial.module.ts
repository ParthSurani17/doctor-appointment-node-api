import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';
import { TestimonialCoreModule } from '../../../core/testimonial-core/testimonial-core.module';
import { AuthModule } from '../../client/auth/auth.module';

@Module({
  imports: [TestimonialCoreModule, AuthModule],
  controllers: [TestimonialController],
  providers: [TestimonialService],
})
export class TestimonialModule {}
