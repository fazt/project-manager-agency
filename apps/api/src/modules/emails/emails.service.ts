import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SendEmailDto {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailsService {
  constructor(private configService: ConfigService) {}

  async sendEmail(dto: SendEmailDto) {
    // In a real app, integrate with Brevo (Sendinblue) here
    console.log('Sending email:', dto);
    return { sent: true, to: dto.to };
  }

  async sendWelcomeEmail(email: string, name: string) {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Project Manager Agency!',
      html: `
        <h1>Welcome, ${name}!</h1>
        <p>Thank you for joining Project Manager Agency.</p>
        <p>Get started by creating your first project.</p>
      `,
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${this.configService.get('APP_URL')}/verify-email?token=${token}`;

    return this.sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}">Verify Email</a>
      `,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.configService.get('APP_URL')}/reset-password?token=${token}`;

    return this.sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `
        <h1>Reset your password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });
  }

  async sendPaymentConfirmation(email: string, amount: number, currency: string) {
    return this.sendEmail({
      to: email,
      subject: 'Payment Confirmation',
      html: `
        <h1>Payment Received</h1>
        <p>We have received your payment of ${amount} ${currency}.</p>
        <p>Thank you for your business!</p>
      `,
    });
  }
}
