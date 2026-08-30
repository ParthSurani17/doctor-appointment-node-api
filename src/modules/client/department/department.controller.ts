import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DepartmentService } from './department.service';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';

// Public — patients (even before signup) can browse departments/specializations.
@ApiTags('Client: Department')
@Controller('departments')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get()
  @ApiOperation({ summary: 'List departments/specializations' })
  findAll(@Query() query: BaseQueryCoreDto) {
    return this.departmentService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by id' })
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }
}
