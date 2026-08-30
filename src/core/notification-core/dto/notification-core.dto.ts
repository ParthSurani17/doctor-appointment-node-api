import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../../core/base-query-core/dto';

export class NotificationCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: Notification[];
}
