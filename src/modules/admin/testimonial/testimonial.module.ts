import { Module } from '@nestjs/common';
import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';
import { TestimonialCoreModule } from '../../../core/testimonial-core/testimonial-core.module';
import { AuthModule } from '../../client/auth/auth.module';
import { AdminAuthModule } from '../auth/admin-auth.module';
import { PublicTestimonialController } from './public-testimonial.controller';

@Module({
  imports: [TestimonialCoreModule, AuthModule, AdminAuthModule],
  controllers: [TestimonialController, PublicTestimonialController],
  providers: [TestimonialService],
})
export class TestimonialModule {}
