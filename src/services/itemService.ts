import { api } from './api';
import type { IItem } from '@/types';

export const itemService = {
  getAll: () => api.get<IItem[]>('/items'),
  getById: (id: number) => api.get<IItem>(`/items/${id}`),
  create: (data: Omit<IItem, 'id'>) => api.post<IItem>('/items', data),
  update: (id: number, data: Omit<IItem, 'id'>) => api.put<IItem>(`/items/${id}`, data),
  delete: (id: number) => api.delete(`/items/${id}`),
};
