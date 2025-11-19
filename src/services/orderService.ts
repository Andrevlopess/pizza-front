import { api } from './api';
import type { IOrder } from '@/types';

export const orderService = {
  getAll: () => api.get<IOrder[]>('/orders'),
  getById: (id: number) => api.get<IOrder>(`/orders/${id}`),
  create: (data: Omit<IOrder, 'id'>) => api.post<IOrder>('/orders', data),
  update: (id: number, data: Omit<IOrder, 'id'>) => api.put<IOrder>(`/orders/${id}`, data),
  delete: (id: number) => api.delete(`/orders/${id}`),
};
