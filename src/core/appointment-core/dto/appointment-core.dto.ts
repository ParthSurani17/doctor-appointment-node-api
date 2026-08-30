import { ApiProperty } from '@nestjs/swagger';
import { Appointment } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../../core/base-query-core/dto';

export class AppointmentCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: Appointment[];
}
