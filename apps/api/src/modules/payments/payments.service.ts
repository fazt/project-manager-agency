import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where: { userId } }),
    ]);

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.userId !== userId) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getInvoice(userId: string, id: string) {
    const payment = await this.findOne(userId, id);

    // In a real app, generate or fetch invoice from Stripe
    return {
      invoiceId: `INV-${payment.id}`,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      date: payment.createdAt,
      downloadUrl: `https://invoices.example.com/${payment.id}`,
    };
  }
}
