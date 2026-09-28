import { BadRequestException, Injectable } from '@nestjs/common';
import { dayOfWeekFromDate, generateSlotsForDay, nextDay, startOfDay } from '../../../shared/libs/slot-generator';
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
import { UploadService } from '../../../shared/modules/upload/upload.service';
import { RESOURCE_TYPE } from '../../../shared/modules/upload/dto/upload.dto';

@Injectable()
export class DoctorService {
  constructor(
    private doctorCoreService: DoctorCoreService,
    private doctorAvailabilityCoreService: DoctorAvailabilityCoreService,
    private departmentCoreService: DepartmentCoreService,
    private uploadService: UploadService,
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

  async uploadPhoto(id: string, file: any) {
    await this.doctorCoreService.checkId({ where: { id } });
    const uploaded = await this.uploadService.saveLocalFile({
      file,
      resourceType: RESOURCE_TYPE.DOCTOR,
    });
    const doctor = await this.doctorCoreService.update({
      where: { id },
      data: { photoUrl: uploaded.url },
    });
    return { doctor, ...uploaded };
  }

  // â”€â”€â”€ Availability â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  async generateSlots() {
    const prisma = this.doctorCoreService.prisma;
    const now = new Date();
    const dateLabel = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const today = startOfDay(dateLabel(now));
    const dates: Date[] = [];
    for (let date = today; dates.length < 30; date = nextDay(date)) dates.push(date);
    const doctors = await prisma.doctor.findMany({
      where: { isDeleted: false, status: 'ENABLED' },
      select: { id: true, name: true, availability: { where: { isActive: true } } },
    });
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: { in: doctors.map((doctor) => doctor.id) },
        date: { gte: today, lt: nextDay(dates[dates.length - 1]) },
        status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] },
        isDeleted: false,
      },
      select: { doctorId: true, date: true, timeSlot: true },
    });
    const booked = new Set(appointments.map((appointment) =>
      `${appointment.doctorId}/${dateLabel(appointment.date)}/${appointment.timeSlot}`,
    ));
    const results = doctors.map((doctor) => {
      const schedule = dates.map((date) => {
        const label = dateLabel(date);
        const windows = doctor.availability.filter((window) => window.day === dayOfWeekFromDate(date));
        const slots = [...new Set(generateSlotsForDay(windows))]
          .filter((time) => new Date(`${label}T${time}:00`) > now)
          .map((time) => ({ time, isBooked: booked.has(`${doctor.id}/${label}/${time}`) }));
        return { date: label, slots };
      });
      return {
        doctorId: doctor.id,
        doctorName: doctor.name,
        status: doctor.availability.length ? 'GENERATED' : 'NO_AVAILABILITY',
        availableSlots: schedule.reduce((sum, day) => sum + day.slots.filter((slot) => !slot.isBooked).length, 0),
        schedule,
      };
    });
    return {
      fromDate: dateLabel(today),
      toDate: dateLabel(dates[dates.length - 1]),
      doctorsChecked: doctors.length,
      doctorsWithoutAvailability: results.filter((doctor) => doctor.status === 'NO_AVAILABILITY').length,
      recurring: true,
      doctors: results,
      message: 'Slots calculated from each doctor?s saved weekly availability for the next 30 days. No schedules or bookings were changed. Weekly availability continues beyond this date range.',
    };
  }

  async removeAvailability(availabilityId: string) {
    return this.doctorAvailabilityCoreService.delete({
      where: { id: availabilityId },
    });
  }
}
