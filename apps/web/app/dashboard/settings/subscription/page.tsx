'use client';

import { useState, useEffect } from 'react';
import { subscriptionsApi, type Plan, type Subscription } from '@/lib/api';

const planFeatures: Record<string, string[]> = {
  FREE: ['1 project', '2 clients', '100MB storage', 'Basic features'],
  BASIC: ['5 projects', '10 clients', '1GB storage', 'Basic reports', 'Priority support'],
  PRO: ['20 projects', '50 clients', '5GB storage', 'Advanced reports', 'API access', 'Integrations'],
  ENTERPRISE: ['Unlimited projects', 'Unlimited clients', '20GB storage', 'Custom reports', 'Dedicated support'],
};

export default function SubscriptionSettingsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token') || '';
        const [plansData, subscriptionData] = await Promise.all([
          subscriptionsApi.getPlans(),
          subscriptionsApi.getCurrent(token).catch(() => null),
        ]);
        setPlans(plansData);
        setCurrentSubscription(subscriptionData);
      } catch (error) {
        console.error('Failed to fetch subscription data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpgrade = async (planId: string) => {
    setIsProcessing(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      const response = await subscriptionsApi.checkout(planId as Plan['id'], token);
      window.location.href = response.url;
    } catch (error) {
      console.error('Failed to start checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('access_token') || '';
      await subscriptionsApi.cancel(token);
      const subscriptionData = await subscriptionsApi.getCurrent(token);
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const currentPlan = currentSubscription?.plan || 'FREE';

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Subscription</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your subscription and billing preferences.
      </p>

      {/* Current Plan */}
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Current Plan</h2>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{currentPlan}</p>
            {currentSubscription && (
              <p className="mt-1 text-sm text-muted-foreground">
                {currentSubscription.cancelAtPeriodEnd
                  ? `Cancels on ${new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}`
                  : `Renews on ${new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}`}
              </p>
            )}
          </div>
          {currentPlan !== 'FREE' && !currentSubscription?.cancelAtPeriodEnd && (
            <button
              onClick={handleCancel}
              disabled={isProcessing}
              className="rounded-lg border border-destructive px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Available Plans</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['FREE', 'BASIC', 'PRO', 'ENTERPRISE'].map((planId) => {
            const isCurrentPlan = currentPlan === planId;
            const prices: Record<string, number> = {
              FREE: 0,
              BASIC: 19,
              PRO: 49,
              ENTERPRISE: 99,
            };

            return (
              <div
                key={planId}
                className={`rounded-lg border p-6 ${
                  isCurrentPlan ? 'border-primary ring-2 ring-primary' : 'border-border'
                }`}
              >
                <h3 className="font-semibold text-foreground">{planId}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-foreground">${prices[planId]}</span>
                  <span className="text-muted-foreground">/month</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {planFeatures[planId]?.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(planId)}
                  disabled={isCurrentPlan || isProcessing}
                  className={`mt-6 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isCurrentPlan
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  } disabled:opacity-50`}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
