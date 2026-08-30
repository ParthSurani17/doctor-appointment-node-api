import { BadRequestException, Injectable } from '@nestjs/common';
import { DepartmentCoreService } from '../../../core/department-core';
import { DoctorCoreService } from '../../../core/doctor-core';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { DepartmentMessages } from '../../../shared/keys/appointment.keys';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';

@Injectable()
export class DepartmentService {
  constructor(
    private departmentCoreService: DepartmentCoreService,
    private doctorCoreService: DoctorCoreService,
  ) {}

  async create(dto: CreateDepartmentDto) {
    const existing = await this.departmentCoreService.findFirst({
      where: { name: dto.name, isDeleted: false },
    }).catch(() => null);

    if (existing) {
      throw new BadRequestException(DepartmentMessages.ALREADY_EXISTS);
    }

    return this.departmentCoreService.create({ data: dto });
  }

  async findAll(query: BaseQueryCoreDto) {
    return this.departmentCoreService.findPaginate(query, { isDeleted: false });
  }

  async findOne(id: string) {
    return this.departmentCoreService.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    return this.departmentCoreService.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.departmentCoreService.checkId({ where: { id } });

    const doctorCount = await this.doctorCoreService.getCount({
      where: { departmentId: id, isDeleted: false },
    });

    if (doctorCount > 0) {
      throw new BadRequestException(DepartmentMessages.HAS_DOCTORS);
    }

    return this.departmentCoreService.update({
      where: { id },
      data: { isDeleted: true },
    });
  }
}
