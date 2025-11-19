import type { IUser, IItem, IOrder } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const storage = {
  getClients: async (): Promise<IUser[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  saveClients: async (clients: IUser[]) => {
    await Promise.all(clients.map(client =>
      fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      })
    ));
  },

  getItems: async (): Promise<IItem[]> => {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
  },

  saveItems: async (items: IItem[]) => {
    await Promise.all(items.map(item =>
      fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      })
    ));
  },

  getOrders: async (): Promise<IOrder[]> => {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  saveOrders: async (orders: IOrder[]) => {
    await Promise.all(orders.map(order =>
      fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      })
    ));
  },
};
