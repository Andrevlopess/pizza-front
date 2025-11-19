import { api } from './api';

export interface DashboardStats {
  total_orders_today: number;
  unique_customers_today: number;
  total_revenue_cents: number;
  total_revenue: string;
}

export const dashboardService = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
};
