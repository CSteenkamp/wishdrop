import nodemailer from 'nodemailer';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn('[email] EMAIL_USER or EMAIL_PASS not set — email sending will fail');
}

let _transporter: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
    });
  }
  return _transporter;
}

export function getEmailFrom(): string {
  return process.env.EMAIL_FROM || 'WishDrop <noreply@wishdrop.wagnerway.co.za>';
}
