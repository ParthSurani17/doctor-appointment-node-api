import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { UserLoginJwtGuard } from '../auth/guards/user-login-jwt.guard';
import { GetUserSession } from '../../../shared/decorators';
import { UserSessionType } from '../../../shared/types';
import { CreateDoctorReviewDto } from './dto/doctor-review.dto';

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

  @Get(':id/reviews')
  @ApiOperation({ summary: 'List verified patient reviews for a doctor' })
  reviews(@Param('id') id: string) {
    return this.doctorService.reviews(id);
  }

  @Post(':id/reviews')
  @UseGuards(UserLoginJwtGuard)
  @ApiOperation({ summary: 'Leave a review after a completed appointment' })
  createReview(
    @Param('id') id: string,
    @Body() dto: CreateDoctorReviewDto,
    @GetUserSession() session: UserSessionType,
  ) {
    return this.doctorService.createReview(id, session.user.id, dto);
  }

  @Get(':id/available-slots')
  @ApiOperation({ summary: "Get a doctor's bookable time slots for a given date" })
  @ApiQuery({ name: 'date', example: '2026-08-20', description: 'YYYY-MM-DD' })
  getAvailableSlots(@Param('id') id: string, @Query('date') date: string) {
    return this.doctorService.getAvailableSlots(id, date);
  }
}
