import type { IPaymentMethod } from '@/types';
import { api } from './api';

export const paymentMethodService = {
  async getAll(): Promise<IPaymentMethod[]> {
    return api.get<IPaymentMethod[]>('/payment-methods');
  },

  async create(data: Omit<IPaymentMethod, 'id'>): Promise<IPaymentMethod> {
    return api.post<IPaymentMethod>('/payment-methods', data);
  },

  async update(id: number, data: Omit<IPaymentMethod, 'id'>): Promise<IPaymentMethod> {
    return api.put<IPaymentMethod>(`/payment-methods/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/payment-methods/${id}`);
  },
};
