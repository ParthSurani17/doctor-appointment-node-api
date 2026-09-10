import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export enum FILE_TYPE {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum RESOURCE_TYPE {
  DOCTOR = 'DOCTOR',
  USER = 'USER',
  TRIP = 'TRIP',
  TRIP_ALBUM = 'TRIP_ALBUM',
  TRIP_SHARE = 'TRIP_SHARE',
  TRAVEL_PACKAGE = 'TRAVEL_PACKAGE',
  TRAVEL_ALBUM = 'TRAVEL_ALBUM',
  MESSAGE = 'MESSAGE',
}

export class UploadFileDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ enum: FILE_TYPE })
  @IsEnum(FILE_TYPE)
  fileType: FILE_TYPE;

  @ApiProperty({ enum: RESOURCE_TYPE })
  @ValidateIf((o: any) => o.type === RESOURCE_TYPE.USER)
  @IsEnum(RESOURCE_TYPE)
  resourceType: RESOURCE_TYPE;
}
