import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AppointmentCoreService } from '../../../core/appointment-core';
import { DoctorCoreService } from '../../../core/doctor-core';
import { DoctorAvailabilityCoreService } from '../../../core/doctor-availability-core';
import { UserCoreService } from '../../../core/user-core/user-core.service';
import { BaseQueryCoreDto } from '../../../core/base-query-core/dto';
import { RescheduleAppointmentDto, UpdateAppointmentStatusDto } from './dto/appointment.dto';
import { AppointmentStatus } from '@prisma/client';
import { MailService } from '../../../shared/modules/mail/mail.service';
import { AppointmentMessages, DoctorMessages } from '../../../shared/keys/appointment.keys';
import {
  dayOfWeekFromDate,
  generateSlotsForDay,
  nextDay,
  startOfDay,
} from '../../../shared/libs/slot-generator';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    private appointmentCoreService: AppointmentCoreService,
    private doctorCoreService: DoctorCoreService,
    private doctorAvailabilityCoreService: DoctorAvailabilityCoreService,
    private userCoreService: UserCoreService,
    private mailService: MailService,
  ) {}

  async findAll(
    query: BaseQueryCoreDto & {
      doctorId?: string;
      status?: AppointmentStatus;
      date?: string;
    },
  ) {
    const { doctorId, status, date, ...rest } = query as any;
    const baseWhere: any = { isDeleted: false };
    if (doctorId) baseWhere.doctorId = doctorId;
    if (status) baseWhere.status = status;
    if (date) {
      const day = new Date(date);
      const nextDayDate = new Date(day);
      nextDayDate.setDate(day.getDate() + 1);
      baseWhere.date = { gte: day, lt: nextDayDate };
    }

    return this.appointmentCoreService.findPaginate(
      { ...rest, include: ['patient', 'doctor'] } as any,
      baseWhere,
    );
  }

  async findOne(id: string) {
    return this.appointmentCoreService.findUniqueIncludes(
      { where: { id } },
      { include: ['patient', 'doctor'] },
    );
  }

  async updateStatus(id: string, dto: UpdateAppointmentStatusDto) {
    const updated = await this.appointmentCoreService.update({
      where: { id },
      data: { status: dto.status },
    });

    if (
      dto.status === 'CONFIRMED' ||
      dto.status === 'CANCELLED' ||
      dto.status === 'COMPLETED'
    ) {
      this.sendStatusEmail(updated, dto.status).catch((err) =>
        this.logger.error(`Failed to send status-update email: ${err.message}`),
      );
    }

    return updated;
  }

  async reschedule(id: string, dto: RescheduleAppointmentDto) {
    const appointment = await this.appointmentCoreService
      .findFirst({ where: { id, isDeleted: false } })
      .catch(() => null);

    if (!appointment) {
      throw new NotFoundException(AppointmentMessages.NOT_FOUND);
    }

    const doctorId = dto.doctorId || appointment.doctorId;

    const doctor = await this.doctorCoreService
      .findFirst({ where: { id: doctorId, isDeleted: false } })
      .catch(() => null);
    if (!doctor) {
      throw new NotFoundException(DoctorMessages.NOT_FOUND);
    }

    const date = startOfDay(dto.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('date must be a valid YYYY-MM-DD value.');
    }

    const availabilities = await this.doctorAvailabilityCoreService.findMany({
      where: { doctorId, day: dayOfWeekFromDate(date), isActive: true },
    });
    const offeredSlots = new Set(generateSlotsForDay(availabilities));
    if (!offeredSlots.has(dto.timeSlot)) {
      throw new BadRequestException(AppointmentMessages.SLOT_NOT_OFFERED);
    }

    const conflict = await this.appointmentCoreService
      .findFirst({
        where: {
          id: { not: id },
          doctorId,
          date: { gte: date, lt: nextDay(date) },
          timeSlot: dto.timeSlot,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      })
      .catch(() => null);
    if (conflict) {
      throw new BadRequestException(AppointmentMessages.SLOT_NOT_AVAILABLE);
    }

    const updated = await this.appointmentCoreService.update({
      where: { id },
      data: {
        doctorId,
        date,
        timeSlot: dto.timeSlot,
        status: 'CONFIRMED',
      },
    });

    this.sendStatusEmail(updated, 'CONFIRMED', 'Your appointment has been rescheduled').catch(
      (err) => this.logger.error(`Failed to send reschedule email: ${err.message}`),
    );

    return updated;
  }

  async remove(id: string) {
    return this.appointmentCoreService.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  private async sendStatusEmail(
    appointment: { patientId: string; doctorId: string; date: Date; timeSlot: string },
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
    reason?: string,
  ) {
    const [patient, doctor] = await Promise.all([
      this.userCoreService.findUnique({ where: { id: appointment.patientId } }),
      this.doctorCoreService.findUnique({ where: { id: appointment.doctorId } }),
    ]);

    if (!patient?.email) return;

    await this.mailService.sendAppointmentStatusUpdate({
      to: patient.email,
      patientName: patient.fullName || '',
      doctorName: doctor?.name || '',
      date: appointment.date.toISOString().slice(0, 10),
      timeSlot: appointment.timeSlot,
      status,
      reason,
    });
  }
}
