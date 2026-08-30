import { ApiProperty } from '@nestjs/swagger';
import { DoctorAvailability } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../../core/base-query-core/dto';

export class DoctorAvailabilityCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: DoctorAvailability[];
}
