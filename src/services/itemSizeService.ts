import type { IItemSize } from '@/types';
import { api } from './api';

export const itemSizeService = {
  async getAll(): Promise<IItemSize[]> {
    return api.get<IItemSize[]>('/item-sizes');
  },

  async create(data: Omit<IItemSize, 'id'>): Promise<IItemSize> {
    return api.post<IItemSize>('/item-sizes', data);
  },

  async update(id: number, data: Omit<IItemSize, 'id'>): Promise<IItemSize> {
    return api.put<IItemSize>(`/item-sizes/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/item-sizes/${id}`);
  },
};
