import { api } from './client';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string;
  stripePaymentId?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentsResponse {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentsQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
}

export const paymentsApi = {
  getAll: (query: PaymentsQuery = {}, token: string) => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.status) params.append('status', query.status);

    const queryString = params.toString();
    return api.get<PaymentsResponse>(`/payments${queryString ? `?${queryString}` : ''}`, { token });
  },

  getById: (id: string, token: string) =>
    api.get<Payment>(`/payments/${id}`, { token }),

  getInvoice: (id: string, token: string) =>
    api.get<{ url: string }>(`/payments/${id}/invoice`, { token }),
};
