import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { AppointmentCoreService } from '../../../core/appointment-core';
import { DoctorCoreService } from '../../../core/doctor-core';
import { DoctorAvailabilityCoreService } from '../../../core/doctor-availability-core';
import { DepartmentCoreService } from '../../../core/department-core';
import { UserCoreService } from '../../../core/user-core/user-core.service';
import { NotificationCoreService } from '../../../core/notification-core';
import { UserNotificationCoreService } from '../../../core/user-notification-core';
import { AppointmentMessages, DoctorMessages } from '../../../shared/keys/appointment.keys';
import { BookAppointmentDto } from './dto/appointment.dto';
import {
  dayOfWeekFromDate,
  generateSlotsForDay,
  nextDay,
  startOfDay,
} from '../../../shared/libs/slot-generator';
import { MailService } from '../../../shared/modules/mail/mail.service';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    private appointmentCoreService: AppointmentCoreService,
    private doctorCoreService: DoctorCoreService,
    private doctorAvailabilityCoreService: DoctorAvailabilityCoreService,
    private departmentCoreService: DepartmentCoreService,
    private userCoreService: UserCoreService,
    private notificationCoreService: NotificationCoreService,
    private userNotificationCoreService: UserNotificationCoreService,
    private mailService: MailService,
  ) {}

  async book(patientId: string, dto: BookAppointmentDto) {
    const doctor = await this.doctorCoreService
      .findFirst({ where: { id: dto.doctorId, isDeleted: false, status: 'ENABLED' } })
      .catch(() => null);

    if (!doctor) {
      throw new NotFoundException(DoctorMessages.NOT_FOUND);
    }

    const date = startOfDay(dto.date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('date must be a valid YYYY-MM-DD value.');
    }

    const today = startOfDay(new Date().toISOString().slice(0, 10));
    if (date < today) {
      throw new BadRequestException(AppointmentMessages.PAST_DATE);
    }

    // Confirm the doctor actually offers this slot on this day of week.
    const availabilities = await this.doctorAvailabilityCoreService.findMany({
      where: { doctorId: dto.doctorId, day: dayOfWeekFromDate(date), isActive: true },
    });
    const offeredSlots = new Set(generateSlotsForDay(availabilities));
    if (!offeredSlots.has(dto.timeSlot)) {
      throw new BadRequestException(AppointmentMessages.SLOT_NOT_OFFERED);
    }

    // Confirm nobody has already booked this exact slot.
    // The database unique index also protects concurrent booking requests.
    const conflict = await this.appointmentCoreService.findFirst({
      where: {
        doctorId: dto.doctorId,
        date: { gte: date, lt: nextDay(date) },
        timeSlot: dto.timeSlot,
        status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] },
        isDeleted: false,
      },
    }).catch(() => null);

    if (conflict) {
      throw new BadRequestException(AppointmentMessages.SLOT_NOT_AVAILABLE);
    }

    const appointment = await this.appointmentCoreService.create({
      data: {
        patientId,
        doctorId: dto.doctorId,
        date,
        timeSlot: dto.timeSlot,
        reason: dto.reason,
        patientName: dto.patientName,
        patientEmail: dto.patientEmail,
        patientPhone: dto.patientPhone,
        patientAge: dto.patientAge,
        patientGender: dto.patientGender,
      },
    });

    // Fire the confirmation email + admin notification — failures here
    // shouldn't fail the booking itself (already created), just get logged.
    this.sendBookingEmail(patientId, doctor, dto).catch((err) =>
      this.logger.error(`Failed to send booking email: ${err.message}`),
    );
    this.sendDoctorBookingEmail(appointment.id, doctor, dto).catch((err) =>
      this.logger.error(`Failed to send doctor booking email: ${err.message}`),
    );
    this.notifyAdminsOfBooking(patientId, doctor, dto).catch((err) =>
      this.logger.error(`Failed to create admin notification: ${err.message}`),
    );

    return appointment;
  }

  async myAppointments(
    patientId: string,
    filter: 'upcoming' | 'past' | 'cancelled' | 'all' = 'upcoming',
  ) {
    const where: any = { patientId, isDeleted: false };
    const today = startOfDay(new Date().toISOString().slice(0, 10));

    if (filter === 'upcoming') {
      where.date = { gte: today };
      where.status = { in: ['PENDING', 'CONFIRMED'] };
    } else if (filter === 'past') {
      where.OR = [{ date: { lt: today } }, { status: 'COMPLETED' }];
    } else if (filter === 'cancelled') {
      where.status = 'CANCELLED';
    }

    return this.appointmentCoreService.findMany({
      where,
      orderBy: { date: filter === 'past' ? 'desc' : 'asc' },
      include: {
        doctor: {
          include: { department: true },
        },
        patient: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
      },
    } as any);
  }

  async cancel(patientId: string, appointmentId: string) {
    const appointment = await this.appointmentCoreService
      .findFirst({ where: { id: appointmentId, isDeleted: false } })
      .catch(() => null);

    if (!appointment) {
      throw new NotFoundException(AppointmentMessages.NOT_FOUND);
    }

    if (appointment.patientId !== patientId) {
      throw new ForbiddenException(AppointmentMessages.NOT_OWNER);
    }

    if (appointment.status === 'CANCELLED') {
      throw new BadRequestException(AppointmentMessages.ALREADY_CANCELLED);
    }

    if (appointment.status === 'COMPLETED') {
      throw new BadRequestException(AppointmentMessages.CANNOT_CANCEL_COMPLETED);
    }

    return this.appointmentCoreService.update({
      where: { id: appointmentId },
      data: { status: 'CANCELLED' },
    });
  }

  private async sendBookingEmail(
    patientId: string,
    doctor: { id: string; name: string; departmentId: string; fee: number },
    dto: BookAppointmentDto,
  ) {
    const [patient, department] = await Promise.all([
      this.userCoreService.findUnique({ where: { id: patientId } }),
      this.departmentCoreService
        .findFirst({ where: { id: doctor.departmentId } })
        .catch(() => null),
    ]);

    if (!patient?.email) return;

    await this.mailService.sendBookingConfirmation({
      to: patient.email,
      patientName: patient.fullName || '',
      doctorName: doctor.name,
      departmentName: department?.name,
      date: dto.date,
      timeSlot: dto.timeSlot,
      fee: doctor.fee,
    });
  }

  private async sendDoctorBookingEmail(
    appointmentId: string,
    doctor: {
      id: string;
      name: string;
      email?: string | null;
      departmentId: string;
    },
    dto: BookAppointmentDto,
  ) {
    if (!doctor.email) return;

    const department = await this.departmentCoreService
      .findFirst({ where: { id: doctor.departmentId } })
      .catch(() => null);

    await this.mailService.sendDoctorBookingNotification({
      to: doctor.email,
      doctorName: doctor.name,
      appointmentId,
      departmentName: department?.name,
      date: dto.date,
      timeSlot: dto.timeSlot,
    });
  }

  private async notifyAdminsOfBooking(
    patientId: string,
    doctor: { id: string; name: string },
    dto: BookAppointmentDto,
  ) {
    const [patient, admins] = await Promise.all([
      this.userCoreService.findUnique({ where: { id: patientId } }),
      this.userCoreService.findMany({
        where: { userType: UserType.ADMIN, isDeleted: false },
      }),
    ]);

    if (!admins.length) return;

    const notification = await this.notificationCoreService.create({
      data: {
        title: 'New appointment booked',
        body: `${patient?.fullName || 'A patient'} booked with ${doctor.name} on ${dto.date} at ${dto.timeSlot}.`,
        target: 'ALL',
      },
    });

    await Promise.all(
      admins.map((admin) =>
        this.userNotificationCoreService.create({
          data: { userId: admin.id, notificationId: notification.id },
        }),
      ),
    );
  }
}
