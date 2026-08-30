import { ApiProperty } from '@nestjs/swagger';
import { Testimonial } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../../core/base-query-core/dto';

export class TestimonialCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: Testimonial[];
}
