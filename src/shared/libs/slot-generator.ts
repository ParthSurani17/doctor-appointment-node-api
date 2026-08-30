import { DayOfWeek } from '@prisma/client';

export const DAY_INDEX_TO_ENUM: DayOfWeek[] = [
  DayOfWeek.SUN,
  DayOfWeek.MON,
  DayOfWeek.TUE,
  DayOfWeek.WED,
  DayOfWeek.THU,
  DayOfWeek.FRI,
  DayOfWeek.SAT,
];

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function toHHmm(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const m = (totalMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

export function dayOfWeekFromDate(date: Date): DayOfWeek {
  return DAY_INDEX_TO_ENUM[date.getDay()];
}

/**
 * Expand a doctor's weekly availability windows (for a single day) into a
 * flat, sorted list of "HH:mm" candidate slot start times.
 */
export function generateSlotsForDay(
  availabilities: { startTime: string; endTime: string; slotDuration: number }[],
): string[] {
  const slots: string[] = [];
  for (const a of availabilities) {
    const start = toMinutes(a.startTime);
    const end = toMinutes(a.endTime);
    for (let t = start; t + a.slotDuration <= end; t += a.slotDuration) {
      slots.push(toHHmm(t));
    }
  }
  return slots.sort();
}

export function startOfDay(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00`);
}

export function nextDay(date: Date): Date {
  const d = new Date(date);
  d.setDate(date.getDate() + 1);
  return d;
}
