import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import {
  CreateDoctorAvailabilityDto,
  CreateDoctorDto,
  UpdateDoctorDto,
} from './dto/doctor.dto';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { AdminLoginJwtGuard } from '../auth/guards/admin-login-jwt.guard';

@ApiTags('Admin: Doctor')
@ApiBearerAuth()
@UseGuards(AdminLoginJwtGuard)
@Controller('admin/doctors')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Post()
  @ApiOperation({ summary: 'Add a doctor' })
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List doctors (optionally filter by departmentId query param)' })
  findAll(@Query() query: BaseQueryCoreDto & { departmentId?: string }) {
    return this.doctorService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a doctor with department & availability' })
  findOne(@Param('id') id: string) {
    return this.doctorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a doctor' })
  update(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete / disable a doctor' })
  remove(@Param('id') id: string) {
    return this.doctorService.remove(id);
  }

  @Post(':id/availability')
  @ApiOperation({ summary: "Add a weekly availability slot for a doctor" })
  addAvailability(
    @Param('id') id: string,
    @Body() dto: CreateDoctorAvailabilityDto,
  ) {
    return this.doctorService.addAvailability(id, dto);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: "List a doctor's weekly availability" })
  listAvailability(@Param('id') id: string) {
    return this.doctorService.listAvailability(id);
  }

  @Delete('availability/:availabilityId')
  @ApiOperation({ summary: 'Remove an availability slot' })
  removeAvailability(@Param('availabilityId') availabilityId: string) {
    return this.doctorService.removeAvailability(availabilityId);
  }
}
