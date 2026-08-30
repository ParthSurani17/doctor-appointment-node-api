import { BadRequestException, Injectable } from '@nestjs/common';
import { DoctorCoreService } from '../../../core/doctor-core';
import { DoctorAvailabilityCoreService } from '../../../core/doctor-availability-core';
import { DepartmentCoreService } from '../../../core/department-core';
import {
  CreateDoctorAvailabilityDto,
  CreateDoctorDto,
  UpdateDoctorDto,
} from './dto/doctor.dto';
import {
  DepartmentMessages,
  DoctorAvailabilityMessages,
} from '../../../shared/keys/appointment.keys';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';

@Injectable()
export class DoctorService {
  constructor(
    private doctorCoreService: DoctorCoreService,
    private doctorAvailabilityCoreService: DoctorAvailabilityCoreService,
    private departmentCoreService: DepartmentCoreService,
  ) {}

  async create(dto: CreateDoctorDto) {
    const department = await this.departmentCoreService
      .findFirst({ where: { id: dto.departmentId, isDeleted: false } })
      .catch(() => null);

    if (!department) {
      throw new BadRequestException(DepartmentMessages.NOT_FOUND);
    }

    return this.doctorCoreService.create({ data: dto });
  }

  async findAll(query: BaseQueryCoreDto & { departmentId?: string }) {
    const { departmentId, ...rest } = query as any;
    const baseWhere: any = { isDeleted: false };
    if (departmentId) baseWhere.departmentId = departmentId;

    return this.doctorCoreService.findPaginate(
      { ...rest, include: ['department', 'availability'] } as any,
      baseWhere,
    );
  }

  async findOne(id: string) {
    const data = await this.doctorCoreService.findUniqueIncludes(
      { where: { id } },
      { include: ['department', 'availability'] },
    );
    if (!data) {
      throw new BadRequestException('Doctor not found');
    }
    return data;
  }

  async update(id: string, dto: UpdateDoctorDto) {
    return this.doctorCoreService.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.doctorCoreService.update({
      where: { id },
      data: { isDeleted: true, status: 'DISABLED' },
    });
  }

  // ─── Availability ───────────────────────

  async addAvailability(doctorId: string, dto: CreateDoctorAvailabilityDto) {
    await this.doctorCoreService.checkId({ where: { id: doctorId } });

    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException(DoctorAvailabilityMessages.INVALID_RANGE);
    }

    const overlapping = await this.doctorAvailabilityCoreService.findFirst({
      where: {
        doctorId,
        day: dto.day,
        startTime: { lt: dto.endTime },
        endTime: { gt: dto.startTime },
      },
    }).catch(() => null);

    if (overlapping) {
      throw new BadRequestException(DoctorAvailabilityMessages.OVERLAPS);
    }

    return this.doctorAvailabilityCoreService.create({
      data: { ...dto, doctorId },
    });
  }

  async listAvailability(doctorId: string) {
    return this.doctorAvailabilityCoreService.findMany({
      where: { doctorId, isActive: true },
    });
  }

  async removeAvailability(availabilityId: string) {
    return this.doctorAvailabilityCoreService.delete({
      where: { id: availabilityId },
    });
  }
}
