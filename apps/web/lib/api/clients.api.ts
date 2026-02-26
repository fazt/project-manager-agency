import { api } from './client';

export type ClientType = 'PERSON' | 'COMPANY';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type: ClientType;
  companyName?: string;
  taxId?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    projects: number;
  };
}

export interface CreateClientData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  type: ClientType;
  companyName?: string;
  taxId?: string;
  website?: string;
  notes?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {}

export interface ClientsResponse {
  data: Client[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientsQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: ClientType;
}

export const clientsApi = {
  getAll: (query: ClientsQuery = {}, token: string) => {
    const params = new URLSearchParams();
    if (query.page) params.append('page', query.page.toString());
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.search) params.append('search', query.search);
    if (query.type) params.append('type', query.type);

    const queryString = params.toString();
    return api.get<ClientsResponse>(`/clients${queryString ? `?${queryString}` : ''}`, { token });
  },

  getById: (id: string, token: string) =>
    api.get<Client>(`/clients/${id}`, { token }),

  create: (data: CreateClientData, token: string) =>
    api.post<Client>('/clients', data, { token }),

  update: (id: string, data: UpdateClientData, token: string) =>
    api.patch<Client>(`/clients/${id}`, data, { token }),

  delete: (id: string, token: string) =>
    api.delete<void>(`/clients/${id}`, { token }),
};
