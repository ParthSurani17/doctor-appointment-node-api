import { Injectable } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { UserCoreService } from '../../../core/user-core/user-core.service';
import { DoctorCoreService } from '../../../core/doctor-core';
import { AppointmentCoreService } from '../../../core/appointment-core';
import { startOfDay, nextDay } from '../../../shared/libs/slot-generator';

@Injectable()
export class DashboardService {
  constructor(
    private userCoreService: UserCoreService,
    private doctorCoreService: DoctorCoreService,
    private appointmentCoreService: AppointmentCoreService,
  ) {}

  async getStats() {
    const today = startOfDay(new Date().toISOString().slice(0, 10));
    const tomorrow = nextDay(today);

    const [
      totalDoctors,
      totalPatients,
      totalAppointments,
      todaysAppointments,
      pendingAppointments,
      confirmedAppointments,
      cancelledAppointments,
      completedAppointments,
      monthlyChart,
    ] = await Promise.all([
      this.doctorCoreService.getCount({ where: { isDeleted: false } }),
      this.userCoreService.getCount({
        where: { isDeleted: false, userType: UserType.PATIENT },
      }),
      this.appointmentCoreService.getCount({ where: { isDeleted: false } }),
      this.appointmentCoreService.getCount({
        where: {
          isDeleted: false,
          date: { gte: today, lt: tomorrow },
          status: { not: 'CANCELLED' },
        },
      }),
      this.appointmentCoreService.getCount({
        where: { isDeleted: false, status: 'PENDING' },
      }),
      this.appointmentCoreService.getCount({
        where: { isDeleted: false, status: 'CONFIRMED' },
      }),
      this.appointmentCoreService.getCount({
        where: { isDeleted: false, status: 'CANCELLED' },
      }),
      this.appointmentCoreService.getCount({
        where: { isDeleted: false, status: 'COMPLETED' },
      }),
      this.getMonthlyChart(),
    ]);

    return {
      totalDoctors,
      totalPatients,
      totalAppointments,
      todaysAppointments,
      pendingAppointments,
      confirmedAppointments,
      cancelledAppointments,
      completedAppointments,
      monthlyChart,
    };
  }

  /** Appointment counts (by createdAt) for the last 6 months, oldest first. */
  private async getMonthlyChart() {
    const now = new Date();
    const months: { label: string; start: Date; end: Date }[] = [];

    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      months.push({
        label: start.toLocaleString('default', { month: 'short' }),
        start,
        end,
      });
    }

    const counts = await Promise.all(
      months.map((m) =>
        this.appointmentCoreService.getCount({
          where: { isDeleted: false, createdAt: { gte: m.start, lt: m.end } },
        }),
      ),
    );

    return months.map((m, i) => ({ label: m.label, value: counts[i] }));
  }
}
