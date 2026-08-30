export const DepartmentMessages = {
  NOT_FOUND: 'Department not found.',
  DELETED: 'Department is deleted.',
  ALREADY_EXISTS: 'A department with this name already exists.',
  HAS_DOCTORS: 'Cannot delete a department that still has doctors assigned to it.',
};

export const DoctorMessages = {
  NOT_FOUND: 'Doctor not found.',
  DELETED: 'Doctor is deleted.',
  DISABLED: 'Doctor is currently unavailable.',
};

export const DoctorAvailabilityMessages = {
  NOT_FOUND: 'Availability slot not found.',
  DELETED: 'Availability slot is deleted.',
  OVERLAPS: 'This availability overlaps with an existing slot for this doctor.',
  INVALID_RANGE: 'endTime must be after startTime.',
};

export const TestimonialMessages = {
  NOT_FOUND: 'Testimonial not found.',
  DELETED: 'Testimonial is deleted.',
};

export const NotificationMessages = {
  NOT_FOUND: 'Notification not found.',
  DELETED: 'Notification is deleted.',
};

export const AppointmentMessages = {
  NOT_FOUND: 'Appointment not found.',
  DELETED: 'Appointment is deleted.',
  SLOT_NOT_AVAILABLE: 'This time slot is no longer available. Please pick another.',
  SLOT_NOT_OFFERED: 'Doctor does not offer this time slot.',
  PAST_DATE: 'You cannot book an appointment in the past.',
  ALREADY_CANCELLED: 'This appointment is already cancelled.',
  CANNOT_CANCEL_COMPLETED: 'Completed appointments cannot be cancelled.',
  NOT_OWNER: 'You can only manage your own appointments.',
};
