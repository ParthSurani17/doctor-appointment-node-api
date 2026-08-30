import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../../core/base-query-core/dto';

export class DoctorCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: Doctor[];
}
