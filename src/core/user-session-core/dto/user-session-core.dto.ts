import { ApiProperty } from '@nestjs/swagger';
import { UserSession } from '@prisma/client';
import { IsArray } from 'class-validator';
import { CorePaginateDto } from '../../../core/base-query-core/dto';

export class UserSessionCorePaginateDto extends CorePaginateDto {
  @ApiProperty({ required: true })
  @IsArray()
  list?: UserSession[];
}
