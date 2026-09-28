import { DoctorService } from './doctor.service';

describe('generateSlots using saved doctor availability', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-09-28T09:20:00'));
  });
  afterEach(() => jest.useRealTimers());

  function setup() {
    const prisma = {
      doctor: { findMany: jest.fn().mockResolvedValue([
        { id: 'a', name: 'Doctor A', availability: [
          { day: 'MON', startTime: '09:00', endTime: '10:00', slotDuration: 15 },
          { day: 'SUN', startTime: '14:00', endTime: '15:00', slotDuration: 20 },
        ] },
        { id: 'b', name: 'Doctor B', availability: [
          { day: 'MON', startTime: '11:00', endTime: '12:00', slotDuration: 30 },
        ] },
        { id: 'c', name: 'Doctor C', availability: [] },
      ]) },
      appointment: { findMany: jest.fn().mockResolvedValue([
        { doctorId: 'a', date: new Date('2026-09-28T00:00:00'), timeSlot: '09:30' },
      ]) },
    };
    return { prisma, service: new DoctorService({ prisma } as any, {} as any, {} as any, {} as any) };
  }

  it('uses each saved weekday, time window and duration, excluding elapsed times', async () => {
    const { service, prisma } = setup();
    const result = await service.generateSlots();
    expect(result.fromDate).toBe('2026-09-28');
    expect(result.toDate).toBe('2026-10-27');
    expect(result.doctors[0].schedule).toHaveLength(30);
    expect(result.doctors[0].schedule[0].slots).toEqual([
      { time: '09:30', isBooked: true }, { time: '09:45', isBooked: false },
    ]);
    expect(result.doctors[1].schedule[0].slots).toEqual([
      { time: '11:00', isBooked: false }, { time: '11:30', isBooked: false },
    ]);
    expect(result.doctors[0].schedule[1].slots).toEqual([]);
    expect(result.doctors[0].schedule[6].slots.map((slot) => slot.time)).toEqual(['14:00', '14:20', '14:40']);
    expect(result.doctors[0].schedule[7].slots.find((slot) => slot.time === '09:30')?.isBooked).toBe(false);
    expect(prisma.doctor.findMany).toHaveBeenCalledWith({
      where: { isDeleted: false, status: 'ENABLED' },
      select: { id: true, name: true, availability: { where: { isActive: true } } },
    });
    expect(prisma.appointment.findMany.mock.calls[0][0].where).toMatchObject({
      status: { in: ['PENDING', 'CONFIRMED', 'COMPLETED'] }, isDeleted: false,
    });
  });

  it('reports missing availability and returns identical results on repeated calls', async () => {
    const { service } = setup();
    const first = await service.generateSlots();
    expect(first.doctorsWithoutAvailability).toBe(1);
    expect(first.doctors[2]).toMatchObject({ status: 'NO_AVAILABILITY', availableSlots: 0 });
    expect(await service.generateSlots()).toEqual(first);
  });

  it('propagates database failures', async () => {
    const { service, prisma } = setup();
    prisma.appointment.findMany.mockRejectedValueOnce(new Error('Database unavailable'));
    await expect(service.generateSlots()).rejects.toThrow('Database unavailable');
  });
});
