import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
// import { IsDisplayNameValid } from '../../../../shared/decorators';

export class AddUserDto {
  @ApiProperty({ example: 'string' })
  @IsOptional()
  fullName: string;

  @ApiProperty({ example: 'string' })
  @IsOptional()
  // @IsDisplayNameValid()
  displayName: string;

  @ApiProperty()
  @IsOptional()
  profilePic: string;
}

export class ValidateDisplayNameDto {
  @ApiProperty({
    example: 'JohnDoe123',
  })
  @IsString()
  @Length(5, 20, {
    message: 'Display name should be 5-20 characters long.',
  })
  @Matches(/^[a-zA-Z0-9]+([-_\.]?[a-zA-Z0-9]+)*$/, {
    message:
      'Display name should only contain alphanumeric characters or underscores (_), hyphens (-), and periods (.), without starting or ending with special characters',
  })
  displayName: string;
}

export class ReportUserDto {
  @ApiProperty()
  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  reason: string;
}
