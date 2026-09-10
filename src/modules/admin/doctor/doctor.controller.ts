import {
  Body,
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @Post(':id/photo')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          callback(new BadRequestException('Only image files are allowed.'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } }, required: ['file'] } })
  @ApiOperation({ summary: 'Upload and save a doctor profile photo locally' })
  uploadPhoto(@Param('id') id: string, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('An image file is required.');
    }
    return this.doctorService.uploadPhoto(id, file);
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
