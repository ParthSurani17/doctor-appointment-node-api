import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DoctorCoreService } from '../../../core/doctor-core';
import { DoctorAvailabilityCoreService } from '../../../core/doctor-availability-core';
import { AppointmentCoreService } from '../../../core/appointment-core';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { DoctorMessages } from '../../../shared/keys/appointment.keys';
import { CreateDoctorReviewDto } from './dto/doctor-review.dto';
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

    const page = await this.doctorCoreService.findPaginate(rest, baseWhere);
    return {
      ...page,
      list: await Promise.all(page.list.map((doctor) => this.withReviewStats(doctor))),
    };
  }

  async findOne(id: string) {
    const doctor = await this.doctorCoreService.findUniqueIncludes(
      { where: { id } },
      { include: ['department'] },
    );
    return this.withReviewStats(doctor);
  }

  async reviews(doctorId: string) {
    await this.doctorCoreService.findUnique({ where: { id: doctorId } });
    return this.doctorCoreService.prisma.doctorReview.findMany({
      where: { doctorId },
      include: { patient: { select: { fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createReview(doctorId: string, patientId: string, dto: CreateDoctorReviewDto) {
    const completedAppointment = await this.appointmentCoreService.findFirst({
      where: { doctorId, patientId, status: 'COMPLETED', isDeleted: false },
    });
    if (!completedAppointment) {
      throw new BadRequestException('You can review a doctor only after a completed appointment.');
    }

    const existing = await this.doctorCoreService.prisma.doctorReview.findUnique({
      where: { doctorId_patientId: { doctorId, patientId } },
    });
    if (existing) {
      throw new BadRequestException('You have already reviewed this doctor.');
    }

    return this.doctorCoreService.prisma.doctorReview.create({
      data: { doctorId, patientId, rating: dto.rating, comment: dto.comment },
    });
  }

  private async withReviewStats(doctor: any) {
    const stats = await this.doctorCoreService.prisma.doctorReview.aggregate({
      where: { doctorId: doctor.id },
      _avg: { rating: true },
      _count: { id: true },
    });
    return { ...doctor, rating: stats._avg.rating || 0, reviewCount: stats._count.id };
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
        status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] },
        isDeleted: false,
      },
    });
    const bookedSlots = new Set(existingAppointments.map((a) => a.timeSlot));

    return allSlots.map((slot) => ({ time: slot, isBooked: bookedSlots.has(slot) }));
  }
}
