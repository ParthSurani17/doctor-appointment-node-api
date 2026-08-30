import { Injectable } from '@nestjs/common';
import { TestimonialCoreService } from '../../../core/testimonial-core';
import { CreateTestimonialDto } from './dto/testimonial.dto';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';

@Injectable()
export class TestimonialService {
  constructor(private testimonialCoreService: TestimonialCoreService) {}

  async create(dto: CreateTestimonialDto) {
    return this.testimonialCoreService.create({
      data: { ...dto, avatarSeed: dto.avatarSeed || dto.name },
    });
  }

  async findAll(query: BaseQueryCoreDto) {
    return this.testimonialCoreService.findPaginate(query, {});
  }

  async remove(id: string) {
    return this.testimonialCoreService.delete({ where: { id } });
  }
}
