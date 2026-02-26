import { api } from './client';

export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING';

export interface Plan {
  id: SubscriptionPlan;
  name: string;
  price: number;
  projects: number | 'unlimited';
  clients: number | 'unlimited';
  storage: string;
  features: string[];
}

export interface Subscription {
  id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface CheckoutResponse {
  url: string;
}

export const subscriptionsApi = {
  getPlans: () =>
    api.get<Plan[]>('/subscriptions/plans'),

  getCurrent: (token: string) =>
    api.get<Subscription>('/subscriptions/current', { token }),

  checkout: (plan: SubscriptionPlan, token: string) =>
    api.post<CheckoutResponse>('/subscriptions/checkout', { plan }, { token }),

  cancel: (token: string) =>
    api.post<{ message: string }>('/subscriptions/cancel', {}, { token }),
};
