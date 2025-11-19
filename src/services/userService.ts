import { api } from './api';
import type { IUser } from '@/types';

export const userService = {
  getAll: () => api.get<IUser[]>('/users'),
  getById: (id: number) => api.get<IUser>(`/users/${id}`),
  create: (data: Omit<IUser, 'id'>) => api.post<IUser>('/users', data),
  update: (id: number, data: Omit<IUser, 'id'>) => api.put<IUser>(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};
