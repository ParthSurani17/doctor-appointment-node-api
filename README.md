# Doctor Appointment API

NestJS + MongoDB (Prisma) backend for a single-hospital, multi-specialist
doctor appointment system.

- **Admin** manages departments, doctors (+ weekly availability), all
  appointments, and patients (block/unblock).
- **Patient** registers with email/password, browses doctors, books/cancels
  appointments, and gets emailed on booking + status changes.
- Doctor-side login is out of scope for this phase — admin manages doctors
  on their behalf for now.

---

## 1. Prerequisites

- Node.js 18+
- MongoDB running locally as a replica set (`mongodb://localhost:27017`) **or** a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- (Optional) An SMTP account (e.g. Gmail) if you want real emails sent —
  without it, emails are just logged to the console, which is fine for a demo.

> Prisma requires MongoDB to run as a replica set, including for some single-
> record writes. A single-node local replica set is sufficient for development.

---

## 2. Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run start:dev
```

For a local MongoDB Windows service, add `replSetName: rs0` under
`replication` in `mongod.cfg`, restart the service as Administrator, then run
this once in MongoDB Shell:

```javascript
rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "127.0.0.1:27017" }] })
```

API base: `http://localhost:3000/api/` · Swagger docs: `http://localhost:3000/api/`

### 2.1 `.env`

Already included with working local defaults:

```
DATABASE_URL="mongodb://localhost:27017/doctor_appointment?replicaSet=rs0"
PORT=3000

JWT_SECRET="dev-secret-change-me"        # change before any real deployment
JWT_EXPIRES_IN="7d"

MAIL_HOST="smtp.gmail.com"
MAIL_PORT="587"
MAIL_USER=""                              # leave blank to just log emails to console
MAIL_PASS=""
MAIL_FROM="MediBook <no-reply@medibook.demo>"

FRONTEND_RESET_PASSWORD_URL="http://localhost:5173/reset-password"
```

**To send real emails** (Gmail SMTP, easiest for a college demo):
1. Use a Gmail account → Google Account → Security → 2-Step Verification →
   **App Passwords** → generate one.
2. Set `MAIL_USER` to your Gmail address and `MAIL_PASS` to the generated
   16-character app password (not your normal Gmail password).
3. Restart the server. Without this, `MailService` logs the email HTML to
   the console instead — the rest of the app still works fine.

### 2.2 Admin login

There's no public admin-signup route (by design — see `auth.service.ts`).
The seed script creates one for you:

```bash
npm run seed
# ✅ Admin ready — login with email="admin@medibook.demo" password="Admin@123"
```

Override with your own credentials:
```bash
ADMIN_EMAIL=me@clinic.com ADMIN_PASSWORD=SuperSecret1 npm run seed
```

`npm run seed` also creates 5 sample departments and 4 sample doctors with
Mon–Fri availability, so you have data to demo immediately.

---

## 3. Auth model

Both patient and admin log in with **email + password** (bcrypt-hashed,
JWT-issued) — no Firebase required. (Firebase's SDK/config is still present
in the project in case you want to add Google/Apple login later, but nothing
in the core flow depends on it, and the app boots fine without a Firebase
service-account file.)

- `POST /api/auth/register` — patient self-signup. `userType` is always
  forced to `PATIENT` server-side — there is no way for a client to grant
  itself `ADMIN` through this endpoint.
- `POST /api/auth/login` — patient login.
- `POST /admin/auth/login` — admin login (same credential check, requires
  `userType: ADMIN`).
- `POST /api/auth/forgot-password` — always returns the same generic message
  whether or not the email exists (prevents email enumeration); sends a
  reset link if it does.
- `POST /api/auth/reset-password` — `{ token, newPassword }`, token comes
  from the query string of the emailed reset link.
- Every protected route reads `Authorization: Bearer <jwt>` and resolves the
  user via `GetUserSession` (patient-facing) or the `AdminLoginJwtGuard`
  (admin-facing), which additionally checks `userType: ADMIN`.
- A blocked/disabled user (`status: DISABLED`) is rejected at auth time on
  every subsequent request, even with a still-valid JWT.

---

## 4. Full endpoint list

### Auth
```
POST /api/auth/register            { fullName, email, password, phone? }
POST /api/auth/login               { email, password }
POST /admin/auth/login             { email, password }
POST /api/auth/forgot-password     { email, resetUrlBase? }
POST /api/auth/reset-password      { token, newPassword }
POST /api/auth/:sessionId/logout
```

### Patient profile
```
GET   /users/me
PATCH /users/me                    { fullName?, phone?, profilePic? }
```

### Admin: Departments
```
POST   /admin/departments
GET    /admin/departments
PATCH  /admin/departments/:id
DELETE /admin/departments/:id
```

### Admin: Doctors
```
POST   /admin/doctors
GET    /admin/doctors?departmentId=...
GET    /admin/doctors/:id
PATCH  /admin/doctors/:id
DELETE /admin/doctors/:id
POST   /admin/doctors/:id/availability      { day, startTime, endTime, slotDuration }
GET    /admin/doctors/:id/availability
DELETE /admin/doctors/availability/:availabilityId
```

### Admin: Appointments
```
GET   /admin/appointments?doctorId=&status=&date=YYYY-MM-DD
GET   /admin/appointments/:id
PATCH /admin/appointments/:id/status        { status }   // also emails the patient
```

### Admin: Patients
```
GET   /admin/patients?search=...
GET   /admin/patients/:id
PATCH /admin/patients/:id/block
PATCH /admin/patients/:id/unblock
```

### Admin: Dashboard
```
GET /admin/dashboard/stats
```
Returns: `totalDoctors`, `totalPatients`, `totalAppointments`,
`todaysAppointments`, `pendingAppointments`, `confirmedAppointments`,
`cancelledAppointments`, `completedAppointments`, and `monthlyChart`
(last 6 months of appointment counts, for a bar chart).

### Patient: Departments / Doctors (public browsing)
```
GET /departments
GET /departments/:id
GET /doctors?departmentId=...
GET /doctors/:id
GET /doctors/:id/available-slots?date=YYYY-MM-DD
```

### Patient: Appointments (requires patient login)
```
POST /appointments                          { doctorId, date, timeSlot, reason? }   // emails confirmation
GET  /appointments/me?filter=upcoming|past|cancelled|all
POST /appointments/:id/cancel
```

---

## 5. How slot booking works

1. Admin sets a doctor's **weekly availability** (day of week + start/end
   time + slot duration in minutes) via `POST /admin/doctors/:id/availability`.
2. `GET /doctors/:id/available-slots?date=...` expands that day's availability
   windows into individual time slots and marks any already-booked
   (`PENDING`/`CONFIRMED`) appointment as unavailable.
3. `POST /appointments` re-validates the slot is actually offered and not
   already taken before creating the appointment (status starts as
   `PENDING`), then emails the patient a confirmation.
4. When admin later confirms/cancels/completes it (`PATCH
   /admin/appointments/:id/status`), the patient gets another email.

This is a check-then-create, not a database transaction (MongoDB
transactions need a replica set) — good enough for a local demo; worth
mentioning as a known limitation / future improvement in your report.

---

## 6. Project structure

```
src/
  core/                   # generic Prisma-repository services per model
    user-core/  user-session-core/  department-core/
    doctor-core/  doctor-availability-core/  appointment-core/
  modules/
    admin/
      auth/                 # AdminLoginJwtGuard/Strategy + POST /admin/auth/login
      department/  doctor/  appointment/  patient/  dashboard/
    client/
      auth/                 # register/login/forgot-password/reset-password/logout
      user/                  # GET/PATCH /users/me
      department/            # public browse
      doctor/                # public browse + available-slots
      appointment/            # book/list/cancel (guarded) + sends emails
  shared/
    libs/
      prisma-base.repository.ts
      slot-generator.ts      # weekly-availability -> bookable-slots logic
    modules/
      prisma/
      firebase/               # present but optional/unused by the core flow
      mail/                    # Nodemailer service + email templates
      upload/                  # S3 presigned URLs (optional, doctor photos etc.)
    decorators/
      user-session.decorator.ts  # verifies our JWT, resolves req.user
    keys/                     # error/message string constants
prisma/
  schema.prisma
  seed.ts                    # creates admin + sample departments/doctors
```

---

## 7. Known limitations (worth mentioning in your report)

- **Booking conflict check is not atomic.** It's a check-then-create, not a
  transaction, because MongoDB transactions require a replica set. Fine for
  a single-user local demo; a real deployment would want either a replica
  set + transaction, or a unique index workaround.
- **`GET /users` (list all patients)** on the patient side is a leftover
  from the original boilerplate and currently lets any logged-in patient
  list other patients' basic info. Worth restricting or removing before any
  real deployment — flagging it here so it doesn't get missed.
- **Firebase files are present but inert.** `shared/modules/firebase/` and
  the `LoginType.GOOGLE/APPLE` enum values are scaffolding for a possible
  future social-login addition; nothing in the current auth flow depends on
  them, and the app boots fine without a Firebase service-account file.
