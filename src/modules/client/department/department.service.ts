import { Injectable } from '@nestjs/common';
import { DepartmentCoreService } from '../../../core/department-core';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';

@Injectable()
export class DepartmentService {
  constructor(private departmentCoreService: DepartmentCoreService) {}

  async findAll(query: BaseQueryCoreDto) {
    return this.departmentCoreService.findPaginate(query, {
      isDeleted: false,
      status: 'ENABLED',
    });
  }

  async findOne(id: string) {
    return this.departmentCoreService.findUnique({ where: { id } });
  }
}
