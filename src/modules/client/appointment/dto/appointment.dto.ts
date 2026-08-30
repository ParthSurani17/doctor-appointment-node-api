import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { IsIn, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

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
