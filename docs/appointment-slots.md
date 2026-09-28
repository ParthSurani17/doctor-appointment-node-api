# Generate doctor slots

In Postman or Swagger (`/api`), use an admin Bearer token:

```http
POST /admin/doctors/generate-slots
Authorization: Bearer <ADMIN_ACCESS_TOKEN>
```

No body is required. The response contains the next 30 calendar days, starting
from today (server local time), for all enabled, non-deleted doctors. Each doctor
uses their own saved active availability: weekday, start time, end time, and slot
duration. Sunday is included only if that doctor configured it. Elapsed times
are omitted. No fixed hours or extra weekdays are added.

For example, Monday 09:00?10:00 with a 15-minute duration produces 09:00, 09:15,
09:30 and 09:45, while another doctor's 11:00?12:00 with a 30-minute duration
produces 11:00 and 11:30. The current day's elapsed times are removed.

The response has `fromDate`, `toDate`, `doctorsChecked`,
`doctorsWithoutAvailability`, and `doctors`. Each doctor includes `doctorId`,
`doctorName`, `status`, `availableSlots`, and `schedule` (date and slots).
Slots include `time` and `isBooked`. Treat `isBooked: true` as unavailable.
Doctors without active availability return `NO_AVAILABILITY` and empty slots.

Availability is recurring: the endpoint calculates slots without inserting dated
records or changing schedules. Repeated requests do not duplicate anything.
Weekly hours continue beyond the 30-day response range; fetch any upcoming date
with `GET /doctors/:id/available-slots?date=YYYY-MM-DD`.

Set hours in Admin > Doctors > Edit > Availability, or call
`POST /admin/doctors/:id/availability` with the doctor's chosen settings:

```json
{ "day": "MON", "startTime": "09:00", "endTime": "10:00", "slotDuration": 15 }
```

Pending, confirmed, and completed appointments occupy their doctor's date/time.
Cancelled or deleted appointments release it. The database unique index blocks
simultaneous bookings and conflicting reschedules. Generation never resets bookings.
Existing saved hours, including any previously generated defaults, are retained;
edit those availability records if the doctor has chosen different hours.
