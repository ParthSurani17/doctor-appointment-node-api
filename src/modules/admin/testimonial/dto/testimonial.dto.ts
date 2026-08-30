import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'Sneha Kulkarni' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Patient' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'The doctors here are wonderful and caring.' })
  @IsString()
  @IsNotEmpty()
  quote: string;

  @ApiProperty({ required: false, description: 'Seed for the avatar image; defaults to name' })
  @IsString()
  @IsOptional()
  avatarSeed?: string;
}
