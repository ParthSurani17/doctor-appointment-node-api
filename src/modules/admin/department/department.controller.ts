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
import { DepartmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { AdminLoginJwtGuard } from '../auth/guards/admin-login-jwt.guard';

@ApiTags('Admin: Department')
@ApiBearerAuth()
@UseGuards(AdminLoginJwtGuard)
@Controller('admin/departments')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a department/specialization' })
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all departments' })
  findAll(@Query() query: BaseQueryCoreDto) {
    return this.departmentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by id' })
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a department' })
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a department (must have no doctors)' })
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
