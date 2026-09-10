import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty({ example: 'Dr. Asha Patel' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'doctor@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ example: 'MBBS, MD (Cardiology)', required: false })
  @IsString()
  @IsOptional()
  qualification?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 'MediBook City Clinic', required: false })
  @IsString()
  @IsOptional()
  hospital?: string;

  @ApiProperty({ example: 8, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  experience?: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(0)
  fee: number;

  @ApiProperty({ description: 'Department (specialization) id' })
  @IsString()
  @IsNotEmpty()
  departmentId: string;
}

export class UpdateDoctorDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  qualification?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  hospital?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  experience?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  fee?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  departmentId?: string;
}

export class CreateDoctorAvailabilityDto {
  @ApiProperty({ enum: DayOfWeek, example: DayOfWeek.MON })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  day: DayOfWeek;

  @ApiProperty({ example: '10:00', description: '24h HH:mm' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'startTime must be in 24h HH:mm format, e.g. 10:00',
  })
  startTime: string;

  @ApiProperty({ example: '13:00', description: '24h HH:mm' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'endTime must be in 24h HH:mm format, e.g. 13:00',
  })
  endTime: string;

  @ApiProperty({ example: 30, description: 'Slot length in minutes' })
  @IsInt()
  @Min(5)
  slotDuration: number;
}
