import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { BookAppointmentDto } from './dto/appointment.dto';
import { UserLoginJwtGuard } from '../auth/guards/user-login-jwt.guard';
import { GetUserSession } from '../../../shared/decorators';
import { UserSessionType } from '../../../shared/types';

@ApiTags('Client: Appointment')
@ApiBearerAuth()
@UseGuards(UserLoginJwtGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Book an appointment with a doctor' })
  book(@Body() dto: BookAppointmentDto, @GetUserSession() session: UserSessionType) {
    return this.appointmentService.book(session.user.id, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'List my appointments' })
  @ApiQuery({
    name: 'filter',
    required: false,
    enum: ['upcoming', 'past', 'cancelled', 'all'],
  })
  myAppointments(
    @GetUserSession() session: UserSessionType,
    @Query('filter') filter?: 'upcoming' | 'past' | 'cancelled' | 'all',
  ) {
    return this.appointmentService.myAppointments(session.user.id, filter);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel my appointment' })
  cancel(@Param('id') id: string, @GetUserSession() session: UserSessionType) {
    return this.appointmentService.cancel(session.user.id, id);
  }
}
