import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;

    if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
      this.logger.warn(
        'MAIL_HOST/MAIL_USER/MAIL_PASS not set — emails will be logged to the console instead of actually sent. Fill these in .env to send real emails (see README).',
      );
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: Number(MAIL_PORT) || 587,
      secure: Number(MAIL_PORT) === 465,
      auth: { user: MAIL_USER, pass: MAIL_PASS },
    });
  }

  async sendMail(params: { to: string; subject: string; html: string }) {
    const { to, subject, html } = params;

    if (!this.transporter) {
      // Dev fallback so the rest of the app (and the demo) still works
      // without real SMTP creds configured.
      this.logger.log(`[DEV MAIL] To: ${to} | Subject: ${subject}\n${html}`);
      return { sent: false, dev: true };
    }

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to,
        subject,
        html,
      });
      return { sent: true };
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      return { sent: false, error: error.message };
    }
  }

  async sendBookingConfirmation(params: {
    to: string;
    patientName: string;
    doctorName: string;
    departmentName?: string;
    date: string;
    timeSlot: string;
    fee?: number;
  }) {
    const { to, patientName, doctorName, departmentName, date, timeSlot, fee } = params;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#3366FF;">Appointment Booked</h2>
        <p>Hi ${patientName || 'there'},</p>
        <p>Your appointment has been booked successfully. Here are the details:</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:6px 0; color:#666;">Doctor</td><td style="padding:6px 0; font-weight:600;">${doctorName}</td></tr>
          ${departmentName ? `<tr><td style="padding:6px 0; color:#666;">Department</td><td style="padding:6px 0;">${departmentName}</td></tr>` : ''}
          <tr><td style="padding:6px 0; color:#666;">Date</td><td style="padding:6px 0;">${date}</td></tr>
          <tr><td style="padding:6px 0; color:#666;">Time</td><td style="padding:6px 0;">${timeSlot}</td></tr>
          ${fee !== undefined ? `<tr><td style="padding:6px 0; color:#666;">Fee</td><td style="padding:6px 0;">₹${fee}</td></tr>` : ''}
        </table>
        <p>Your appointment status is currently <strong>Pending</strong> until the clinic confirms it. You'll get another email once it's confirmed.</p>
        <p style="color:#999; font-size:12px; margin-top:24px;">If you didn't make this booking, please contact the clinic.</p>
      </div>
    `;

    return this.sendMail({ to, subject: 'Your appointment has been booked', html });
  }

  async sendAppointmentStatusUpdate(params: {
    to: string;
    patientName: string;
    doctorName: string;
    date: string;
    timeSlot: string;
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    reason?: string;
  }) {
    const { to, patientName, doctorName, date, timeSlot, status, reason } = params;

    const statusText: Record<string, string> = {
      CONFIRMED: 'confirmed',
      CANCELLED: 'cancelled',
      COMPLETED: 'marked as completed',
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#3366FF;">Appointment ${statusText[status] || status}</h2>
        <p>Hi ${patientName || 'there'},</p>
        <p>Your appointment with <strong>${doctorName}</strong> on <strong>${date}</strong> at <strong>${timeSlot}</strong> has been ${statusText[status] || status}.</p>
        ${reason ? `<p>Reason: ${reason}</p>` : ''}
      </div>
    `;

    return this.sendMail({ to, subject: `Appointment ${statusText[status] || status}`, html });
  }

  async sendPasswordResetEmail(params: { to: string; resetUrl: string; name?: string }) {
    const { to, resetUrl, name } = params;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color:#3366FF;">Reset your password</h2>
        <p>Hi ${name || 'there'},</p>
        <p>We received a request to reset your password. Click the button below to choose a new one — this link expires in 30 minutes.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#3366FF; color:#fff; padding:10px 20px; border-radius:6px; text-decoration:none;">Reset Password</a>
        </p>
        <p style="color:#999; font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `;

    return this.sendMail({ to, subject: 'Reset your password', html });
  }
}
