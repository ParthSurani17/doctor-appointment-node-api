// /**
//  * Seed script for local/demo data.
//  *
//  * Run with: npm run seed
//  *
//  * --- Admin account ---
//  * There's no public "become admin" endpoint (on purpose — see auth.service.ts),
//  * so the admin login is created here instead. Defaults to:
//  *   email:    admin@medibook.demo
//  *   password: Admin@123
//  * Override via ADMIN_EMAIL / ADMIN_PASSWORD env vars if you want different
//  * credentials, e.g.:
//  *   ADMIN_EMAIL=me@clinic.com ADMIN_PASSWORD=SuperSecret1 npm run seed
//  */
// import { PrismaClient, DayOfWeek, UserType } from '@prisma/client';
// import * as bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@medibook.demo').toLowerCase();
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

// async function main() {
//   // ─── Admin user ───────────────────────────
//   const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

//   await prisma.user.upsert({
//     where: { email: ADMIN_EMAIL },
//     update: { userType: UserType.ADMIN, password: hashedPassword },
//     create: {
//       email: ADMIN_EMAIL,
//       password: hashedPassword,
//       fullName: 'Hospital Admin',
//       userType: UserType.ADMIN,
//     },
//   });
//   console.log(`✅ Admin ready — login with email="${ADMIN_EMAIL}" password="${ADMIN_PASSWORD}" at POST /admin/auth/login`);

//   // ─── Departments ───────────────────────────
//   const departmentNames = [
//     { name: 'Cardiology', description: 'Heart & cardiovascular care' },
//     { name: 'Dermatology', description: 'Skin, hair & nail care' },
//     { name: 'Orthopedics', description: 'Bones, joints & muscles' },
//     { name: 'General Physician', description: 'General checkups & common illnesses' },
//     { name: 'ENT', description: 'Ear, nose & throat' },
//   ];

//   const departments: Record<string, string> = {};
//   for (const d of departmentNames) {
//     const dept = await prisma.department.upsert({
//       where: { name: d.name },
//       update: {},
//       create: d,
//     });
//     departments[d.name] = dept.id;
//   }
//   console.log(`✅ Seeded ${departmentNames.length} departments`);

//   // ─── Doctors + availability ─────────────────
//   const doctorsData = [
//     {
//       name: 'Dr. Asha Patel',
//       department: 'Cardiology',
//       qualification: 'MBBS, MD (Cardiology)',
//       experience: 10,
//       fee: 700,
//     },
//     {
//       name: 'Dr. Rohan Mehta',
//       department: 'Dermatology',
//       qualification: 'MBBS, MD (Dermatology)',
//       experience: 6,
//       fee: 500,
//     },
//     {
//       name: 'Dr. Kavita Shah',
//       department: 'Orthopedics',
//       qualification: 'MBBS, MS (Ortho)',
//       experience: 12,
//       fee: 600,
//     },
//     {
//       name: 'Dr. Sanjay Rao',
//       department: 'General Physician',
//       qualification: 'MBBS, MD',
//       experience: 8,
//       fee: 300,
//     },
//   ];

//   for (const doc of doctorsData) {
//     const existing = await prisma.doctor.findFirst({ where: { name: doc.name } });
//     const doctor =
//       existing ??
//       (await prisma.doctor.create({
//         data: {
//           name: doc.name,
//           qualification: doc.qualification,
//           experience: doc.experience,
//           fee: doc.fee,
//           departmentId: departments[doc.department],
//         },
//       }));

//     const weekdays: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
//     for (const day of weekdays) {
//       const alreadyHasSlot = await prisma.doctorAvailability.findFirst({
//         where: { doctorId: doctor.id, day, startTime: '10:00' },
//       });
//       if (!alreadyHasSlot) {
//         await prisma.doctorAvailability.create({
//           data: {
//             doctorId: doctor.id,
//             day,
//             startTime: '10:00',
//             endTime: '13:00',
//             slotDuration: 30,
//           },
//         });
//         await prisma.doctorAvailability.create({
//           data: {
//             doctorId: doctor.id,
//             day,
//             startTime: '17:00',
//             endTime: '20:00',
//             slotDuration: 30,
//           },
//         });
//       }
//     }
//   }
//   console.log(`✅ Seeded ${doctorsData.length} doctors with Mon–Fri availability`);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });




/**
 * Seed script for local/demo data.
 *
 * Run with: npm run seed
 *
 * --- Admin account ---
 * There's no public "become admin" endpoint (on purpose — see auth.service.ts),
 * so the admin login is created here instead. Defaults to:
 *   email:    admin@medibook.demo
 *   password: Admin@123
 * Override via ADMIN_EMAIL / ADMIN_PASSWORD env vars if you want different
 * credentials, e.g.:
 *   ADMIN_EMAIL=me@clinic.com ADMIN_PASSWORD=SuperSecret1 npm run seed
 */
import { PrismaClient, DayOfWeek, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@medibook.demo').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123';

async function main() {
  // ─── Admin user ───────────────────────────
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const existingAdmin = await prisma.user.findFirst({ where: { email: ADMIN_EMAIL } });
  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { userType: UserType.ADMIN, password: hashedPassword },
    });
  } else {
    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        fullName: 'Hospital Admin',
        userType: UserType.ADMIN,
      },
    });
  }
  console.log(`✅ Admin ready — login with email="${ADMIN_EMAIL}" password="${ADMIN_PASSWORD}" at POST /admin/auth/login`);

  // ─── Departments ───────────────────────────
  const departmentNames = [
    { name: 'Cardiology', description: 'Heart & cardiovascular care' },
    { name: 'Dermatology', description: 'Skin, hair & nail care' },
    { name: 'Orthopedics', description: 'Bones, joints & muscles' },
    { name: 'General Physician', description: 'General checkups & common illnesses' },
    { name: 'ENT', description: 'Ear, nose & throat' },
  ];

  const departments: Record<string, string> = {};
  for (const d of departmentNames) {
    const existingDept = await prisma.department.findFirst({ where: { name: d.name } });
    const dept = existingDept ?? (await prisma.department.create({ data: d }));
    departments[d.name] = dept.id;
  }
  console.log(`✅ Seeded ${departmentNames.length} departments`);

  // ─── Doctors + availability ─────────────────
  const doctorsData = [
    {
      name: 'Dr. Asha Patel',
      department: 'Cardiology',
      qualification: 'MBBS, MD (Cardiology)',
      experience: 10,
      fee: 700,
    },
    {
      name: 'Dr. Rohan Mehta',
      department: 'Dermatology',
      qualification: 'MBBS, MD (Dermatology)',
      experience: 6,
      fee: 500,
    },
    {
      name: 'Dr. Kavita Shah',
      department: 'Orthopedics',
      qualification: 'MBBS, MS (Ortho)',
      experience: 12,
      fee: 600,
    },
    {
      name: 'Dr. Sanjay Rao',
      department: 'General Physician',
      qualification: 'MBBS, MD',
      experience: 8,
      fee: 300,
    },
  ];

  for (const doc of doctorsData) {
    const existing = await prisma.doctor.findFirst({ where: { name: doc.name } });
    const doctor =
      existing ??
      (await prisma.doctor.create({
        data: {
          name: doc.name,
          qualification: doc.qualification,
          experience: doc.experience,
          fee: doc.fee,
          departmentId: departments[doc.department],
        },
      }));

    const weekdays: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    for (const day of weekdays) {
      const alreadyHasSlot = await prisma.doctorAvailability.findFirst({
        where: { doctorId: doctor.id, day, startTime: '10:00' },
      });
      if (!alreadyHasSlot) {
        await prisma.doctorAvailability.create({
          data: {
            doctorId: doctor.id,
            day,
            startTime: '10:00',
            endTime: '13:00',
            slotDuration: 30,
          },
        });
        await prisma.doctorAvailability.create({
          data: {
            doctorId: doctor.id,
            day,
            startTime: '17:00',
            endTime: '20:00',
            slotDuration: 30,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${doctorsData.length} doctors with Mon–Fri availability`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });