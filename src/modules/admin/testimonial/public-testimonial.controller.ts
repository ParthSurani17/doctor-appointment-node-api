import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { TestimonialService } from './testimonial.service';

@ApiTags('Client: Testimonial')
@Controller('testimonials')
export class PublicTestimonialController {
  constructor(private testimonialService: TestimonialService) {}

  @Get()
  @ApiOperation({ summary: 'List testimonials shown on the patient homepage' })
  findAll(@Query() query: BaseQueryCoreDto) {
    return this.testimonialService.findAll(query);
  }
}
