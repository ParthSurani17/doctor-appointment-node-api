import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { AppointmentService } from './appointment.service';
import { RescheduleAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { AdminLoginJwtGuard } from '../auth/guards/admin-login-jwt.guard';

@ApiTags('Admin: Appointment')
@ApiBearerAuth()
@UseGuards(AdminLoginJwtGuard)
@Controller('admin/appointments')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Get()
  @ApiOperation({
    summary:
      'List all appointments (filter by doctorId, status, or date=YYYY-MM-DD query params)',
  })
  findAll(
    @Query()
    query: BaseQueryCoreDto & {
      doctorId?: string;
      status?: AppointmentStatus;
      date?: string;
    },
  ) {
    return this.appointmentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one appointment with patient & doctor details' })
  findOne(@Param('id') id: string) {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Confirm / complete / cancel an appointment' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAppointmentStatusDto) {
    return this.appointmentService.updateStatus(id, dto);
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Reschedule an appointment to a new date/time (and optionally doctor)' })
  reschedule(@Param('id') id: string, @Body() dto: RescheduleAppointmentDto) {
    return this.appointmentService.reschedule(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Permanently remove an appointment record' })
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
