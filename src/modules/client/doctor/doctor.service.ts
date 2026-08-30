import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DoctorCoreService } from '../../../core/doctor-core';
import { DoctorAvailabilityCoreService } from '../../../core/doctor-availability-core';
import { AppointmentCoreService } from '../../../core/appointment-core';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { DoctorMessages } from '../../../shared/keys/appointment.keys';
import {
  dayOfWeekFromDate,
  generateSlotsForDay,
  nextDay,
  startOfDay,
} from '../../../shared/libs/slot-generator';

@Injectable()
export class DoctorService {
  constructor(
    private doctorCoreService: DoctorCoreService,
    private doctorAvailabilityCoreService: DoctorAvailabilityCoreService,
    private appointmentCoreService: AppointmentCoreService,
  ) {}

  async findAll(query: BaseQueryCoreDto & { departmentId?: string; search?: string }) {
    const { departmentId, ...rest } = query as any;
    const baseWhere: any = { isDeleted: false, status: 'ENABLED' };
    if (departmentId) baseWhere.departmentId = departmentId;

    return this.doctorCoreService.findPaginate(rest, baseWhere);
  }

  async findOne(id: string) {
    return this.doctorCoreService.findUniqueIncludes(
      { where: { id } },
      { include: ['department'] },
    );
  }

  /**
   * Given a doctor + a date (YYYY-MM-DD), generate that day's bookable time
   * slots from the doctor's weekly availability, then mark which ones are
   * already taken by an existing (non-cancelled) appointment.
   */
  async getAvailableSlots(doctorId: string, dateStr: string) {
    const doctor = await this.doctorCoreService
      .findFirst({ where: { id: doctorId, isDeleted: false } })
      .catch(() => null);

    if (!doctor) {
      throw new NotFoundException(DoctorMessages.NOT_FOUND);
    }

    const date = startOfDay(dateStr);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('date must be a valid YYYY-MM-DD value.');
    }

    const availabilities = await this.doctorAvailabilityCoreService.findMany({
      where: { doctorId, day: dayOfWeekFromDate(date), isActive: true },
    });

    const allSlots = generateSlotsForDay(availabilities);

    const existingAppointments = await this.appointmentCoreService.findMany({
      where: {
        doctorId,
        date: { gte: date, lt: nextDay(date) },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });
    const bookedSlots = new Set(existingAppointments.map((a) => a.timeSlot));

    return allSlots.map((slot) => ({ time: slot, isBooked: bookedSlots.has(slot) }));
  }
}
