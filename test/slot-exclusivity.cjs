// Run with: node test/slot-exclusivity.cjs (uses the configured test/demo database).
require('dotenv').config();
require('ts-node/register/transpile-only');
const assert = require('node:assert/strict');
const { randomBytes } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const { AppointmentCoreService } = require('../src/core/appointment-core/appointment-core.service');

const prisma = new PrismaClient();
const core = new AppointmentCoreService(prisma);
const doctorId = randomBytes(12).toString('hex');
const otherDoctorId = randomBytes(12).toString('hex');
const patientId = randomBytes(12).toString('hex');
const date = new Date('2099-01-05T00:00:00');
const data = { doctorId, patientId, date, timeSlot: '11:30' };
const unavailable = (error) => error.getStatus?.() === 400;

(async () => {
  try {
    const attempts = await Promise.allSettled([
      core.create({ data }),
      core.create({ data: { ...data, patientId: randomBytes(12).toString('hex') } }),
    ]);
    assert.equal(attempts.filter((r) => r.status === 'fulfilled').length, 1);
    assert.ok(unavailable(attempts.find((r) => r.status === 'rejected').reason));
    const first = attempts.find((r) => r.status === 'fulfilled').value;
    await core.create({ data: { ...data, doctorId: otherDoctorId } });
    await core.create({ data: { ...data, date: new Date('2099-01-06T00:00:00') } });
    await core.update({ where: { id: first.id }, data: { status: 'CANCELLED' } });
    const replacement = await core.create({ data });
    await assert.rejects(core.update({ where: { id: first.id }, data: { status: 'CONFIRMED' } }), unavailable);
    const later = await core.create({ data: { ...data, timeSlot: '12:00' } });
    await assert.rejects(core.update({ where: { id: later.id }, data: { timeSlot: '11:30' } }), unavailable);
    await core.update({ where: { id: replacement.id }, data: { status: 'COMPLETED' } });
    await assert.rejects(core.create({ data }), unavailable);
    await core.update({ where: { id: replacement.id }, data: { isDeleted: true } });
    await core.create({ data });
    console.log('Passed: concurrent booking, separate doctors/dates, cancellation, reactivation, rescheduling, completion, deletion.');
  } finally {
    // Only remove synthetic records created for this run; no emails are sent.
    await prisma.appointment.deleteMany({ where: { doctorId: { in: [doctorId, otherDoctorId] } } });
    await prisma.$disconnect();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
