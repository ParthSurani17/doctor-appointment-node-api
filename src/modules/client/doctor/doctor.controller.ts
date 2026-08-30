import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';

// Public — patients can browse doctors before logging in.
@ApiTags('Client: Doctor')
@Controller('doctors')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get()
  @ApiOperation({ summary: 'List doctors (filter by departmentId query param)' })
  findAll(@Query() query: BaseQueryCoreDto & { departmentId?: string }) {
    return this.doctorService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get doctor profile (with department)' })
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Get(':id/available-slots')
  @ApiOperation({ summary: "Get a doctor's bookable time slots for a given date" })
  @ApiQuery({ name: 'date', example: '2026-08-20', description: 'YYYY-MM-DD' })
  getAvailableSlots(@Param('id') id: string, @Query('date') date: string) {
    return this.doctorService.getAvailableSlots(id, date);
  }
}
