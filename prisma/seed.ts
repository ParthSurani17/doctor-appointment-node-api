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
    { name: 'Pediatrics', description: 'Healthcare for infants, children & adolescents' },
    { name: 'Gynecology', description: "Women's reproductive & maternal healthcare" },
    { name: 'Neurology', description: 'Brain, spine & nervous system care' },
    { name: 'Ophthalmology', description: 'Eye care, vision testing & treatment' },
    { name: 'Dentistry', description: 'Dental, oral & gum healthcare' },
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
      email: 'asha.patel@medibook.demo',
      department: 'Cardiology',
      qualification: 'MBBS, MD (Cardiology)',
      hospital: 'MediBook Heart Centre',
      experience: 10,
      fee: 700,
    },
    {
      name: 'Dr. Rohan Mehta',
      email: 'rohan.mehta@medibook.demo',
      department: 'Dermatology',
      qualification: 'MBBS, MD (Dermatology)',
      hospital: 'MediBook Skin Clinic',
      experience: 6,
      fee: 500,
    },
    {
      name: 'Dr. Kavita Shah',
      email: 'kavita.shah@medibook.demo',
      department: 'Orthopedics',
      qualification: 'MBBS, MS (Ortho)',
      hospital: 'MediBook Bone & Joint Centre',
      experience: 12,
      fee: 600,
    },
    {
      name: 'Dr. Sanjay Rao',
      email: 'sanjay.rao@medibook.demo',
      department: 'General Physician',
      qualification: 'MBBS, MD',
      hospital: 'MediBook Family Clinic',
      experience: 8,
      fee: 300,
    },
    {
      name: 'Dr. Farah Khan',
      email: 'farah.khan@medibook.demo',
      department: 'ENT',
      qualification: 'MBBS, MS (ENT)',
      hospital: 'MediBook ENT Centre',
      experience: 9,
      fee: 550,
    },
    {
      name: 'Dr. Nisha Iyer',
      email: 'nisha.iyer@medibook.demo',
      department: 'Pediatrics',
      qualification: 'MBBS, MD (Pediatrics)',
      hospital: 'MediBook Children’s Hospital',
      experience: 11,
      fee: 650,
    },
    {
      name: 'Dr. Meera Joshi',
      email: 'meera.joshi@medibook.demo',
      department: 'Gynecology',
      qualification: 'MBBS, MS (Obstetrics & Gynecology)',
      hospital: 'MediBook Women’s Care',
      experience: 13,
      fee: 750,
    },
    {
      name: 'Dr. Arjun Nair',
      email: 'arjun.nair@medibook.demo',
      department: 'Neurology',
      qualification: 'MBBS, DM (Neurology)',
      hospital: 'MediBook Neuro Centre',
      experience: 14,
      fee: 900,
    },
    {
      name: 'Dr. Priya Desai',
      email: 'priya.desai@medibook.demo',
      department: 'Ophthalmology',
      qualification: 'MBBS, MS (Ophthalmology)',
      hospital: 'MediBook Eye Institute',
      experience: 10,
      fee: 600,
    },
    {
      name: 'Dr. Vikram Singh',
      email: 'vikram.singh@medibook.demo',
      department: 'Dentistry',
      qualification: 'BDS, MDS (Oral Surgery)',
      hospital: 'MediBook Dental Centre',
      experience: 12,
      fee: 500,
    },
  ];

  for (const doc of doctorsData) {
    const existing = await prisma.doctor.findFirst({ where: { name: doc.name } });
    const doctorData = {
      name: doc.name,
      email: doc.email,
      qualification: doc.qualification,
      hospital: doc.hospital,
      experience: doc.experience,
      fee: doc.fee,
      departmentId: departments[doc.department],
    };
    const doctor = existing
      ? await prisma.doctor.update({ where: { id: existing.id }, data: doctorData })
      : await prisma.doctor.create({ data: doctorData });

    const weekdays: DayOfWeek[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    for (const day of weekdays) {
      for (const window of [
        { startTime: '10:00', endTime: '13:00' },
        { startTime: '17:00', endTime: '20:00' },
      ]) {
        const alreadyHasSlot = await prisma.doctorAvailability.findFirst({
          where: { doctorId: doctor.id, day, startTime: window.startTime, endTime: window.endTime },
        });
        if (!alreadyHasSlot) {
          await prisma.doctorAvailability.create({
            data: { doctorId: doctor.id, day, ...window, slotDuration: 30 },
          });
        }
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
