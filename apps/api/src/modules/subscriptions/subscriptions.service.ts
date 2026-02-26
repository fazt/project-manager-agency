import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

const PLANS = {
  FREE: { name: 'Free', price: 0, projects: 1, clients: 2, storage: 100 },
  BASIC: { name: 'Basic', price: 19, projects: 5, clients: 10, storage: 1024 },
  PRO: { name: 'Pro', price: 49, projects: 20, clients: 50, storage: 5120 },
  ENTERPRISE: { name: 'Enterprise', price: 99, projects: -1, clients: -1, storage: 20480 },
};

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  getPlans() {
    return Object.entries(PLANS).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }

  async getCurrentSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      // Return free plan by default
      return {
        plan: SubscriptionPlan.FREE,
        status: 'ACTIVE',
        limits: PLANS.FREE,
      };
    }

    return {
      ...subscription,
      limits: PLANS[subscription.plan as keyof typeof PLANS],
    };
  }

  async createCheckoutSession(userId: string, plan: SubscriptionPlan) {
    // In a real app, integrate with Stripe here
    // For now, return a mock response
    return {
      checkoutUrl: `https://checkout.stripe.com/mock?plan=${plan}&user=${userId}`,
      sessionId: `session_${Date.now()}`,
    };
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    // In a real app, cancel with Stripe here
    await this.prisma.subscription.update({
      where: { userId },
      data: { status: 'CANCELLED' },
    });

    return { message: 'Subscription cancelled successfully' };
  }

  async handleWebhook(payload: any) {
    // Handle Stripe webhook events
    // This would update subscription status based on Stripe events
    return { received: true };
  }
}
