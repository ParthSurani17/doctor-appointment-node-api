import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Max, Min } from 'class-validator';

export class BookAppointmentDto {
  @ApiProperty({ description: 'Doctor id to book with' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ example: '2026-08-20', description: 'YYYY-MM-DD' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
  date: string;

  @ApiProperty({ example: '10:30', description: '24h HH:mm — must be one of the doctor\'s available-slots' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'timeSlot must be in 24h HH:mm format' })
  timeSlot: string;

  @ApiProperty({ required: false, example: 'Chest pain, follow-up' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ required: false, example: 'Aarav Shah' })
  @IsOptional()
  @IsString()
  patientName?: string;

  @ApiProperty({ required: false, example: 'aarav@example.com' })
  @IsOptional()
  @IsEmail()
  patientEmail?: string;

  @ApiProperty({ required: false, example: '9876543210' })
  @IsOptional()
  @Matches(/^\+?[0-9]{7,15}$/, { message: 'patientPhone must be a valid phone number' })
  patientPhone?: string;

  @ApiProperty({ required: false, example: 32 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  patientAge?: number;

  @ApiProperty({ required: false, enum: ['Female', 'Male', 'Other'] })
  @IsOptional()
  @IsIn(['Female', 'Male', 'Other'])
  patientGender?: string;
}

export class AppointmentListQueryDto {
  @ApiProperty({
    required: false,
    enum: ['upcoming', 'past', 'cancelled', 'all'],
    example: 'upcoming',
  })
  @IsOptional()
  @IsIn(['upcoming', 'past', 'cancelled', 'all'])
  filter?: 'upcoming' | 'past' | 'cancelled' | 'all';
}
