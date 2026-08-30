import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TestimonialService } from './testimonial.service';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { AdminLoginJwtGuard } from '../auth/guards/admin-login-jwt.guard';

@ApiTags('Admin: Testimonial')
// @ApiBearerAuth()
// @UseGuards(AdminLoginJwtGuard)
@Controller('admin/testimonials')
export class TestimonialController {
  constructor(private testimonialService: TestimonialService) {}

  @Post()
  @ApiOperation({ summary: 'Add a testimonial (shown on the public homepage)' })
  create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List testimonials' })
  findAll(@Query() query: BaseQueryCoreDto) {
    return this.testimonialService.findAll(query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a testimonial' })
  remove(@Param('id') id: string) {
    return this.testimonialService.remove(id);
  }
}
