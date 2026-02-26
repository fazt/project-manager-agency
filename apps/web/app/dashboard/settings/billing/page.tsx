'use client';

import { useState, useEffect } from 'react';
import { paymentsApi, type Payment } from '@/lib/api';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

export default function BillingSettingsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('access_token') || '';
        const response = await paymentsApi.getAll({}, token);
        setPayments(response.data);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handleDownloadInvoice = async (paymentId: string) => {
    try {
      const token = localStorage.getItem('access_token') || '';
      const response = await paymentsApi.getInvoice(paymentId, token);
      window.open(response.url, '_blank');
    } catch (error) {
      console.error('Failed to get invoice:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Billing & Payments</h1>
      <p className="mt-1 text-muted-foreground">
        View your payment history and download invoices.
      </p>

      {/* Payment History */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Payment History</h2>

        {payments.length === 0 ? (
          <div className="mt-4 rounded-lg border border-border bg-card p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-foreground">No payments yet</h3>
            <p className="mt-1 text-muted-foreground">
              Your payment history will appear here once you make a purchase.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-foreground">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {payment.description || 'Subscription payment'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                      ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[payment.status]}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {payment.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleDownloadInvoice(payment.id)}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Billing Information */}
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Billing Information</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          To update your billing information or payment method, please contact our support team.
        </p>
        <a
          href="mailto:support@projectmanager.com"
          className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
