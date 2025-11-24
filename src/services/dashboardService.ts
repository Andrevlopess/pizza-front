import { api } from './api';

export interface DashboardStats {
  total_orders_today: number;
  unique_customers_today: number;
  total_revenue_cents: number;
  total_revenue: string;
}

export const dashboardService = {
  getStats: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const queryString = params.toString();
    return api.get<DashboardStats>(`/dashboard/stats${queryString ? `?${queryString}` : ''}`);
  },
};
