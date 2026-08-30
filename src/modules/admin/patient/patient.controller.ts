import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { AdminLoginJwtGuard } from '../auth/guards/admin-login-jwt.guard';

@ApiTags('Admin: Patient')
@ApiBearerAuth()
@UseGuards(AdminLoginJwtGuard)
@Controller('admin/patients')
export class PatientController {
  constructor(private patientService: PatientService) {}

  @Get()
  @ApiOperation({ summary: 'List all patients (search by name/email query param)' })
  findAll(@Query() query: BaseQueryCoreDto & { search?: string }) {
    return this.patientService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one patient' })
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Block a patient (disables their login/booking)' })
  block(@Param('id') id: string) {
    return this.patientService.block(id);
  }

  @Patch(':id/unblock')
  @ApiOperation({ summary: 'Unblock a patient' })
  unblock(@Param('id') id: string) {
    return this.patientService.unblock(id);
  }
}
