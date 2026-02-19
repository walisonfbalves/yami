import { Injectable } from '@angular/core';
import { Observable, from, of, switchMap, map, catchError } from 'rxjs';
import { SupabaseService } from '../../../core/services/supabase.service';
import { StoreService } from '../../../core/services/store.service';
import { inject } from '@angular/core';

export interface AnalyticsData {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  avgTicket: number;
  cancelRate: number;
  revenueChart: { labels: string[], data: number[] };
  topProducts: { rank: number, name: string, quantity: number, revenue: number }[];
  prepTime: { current: number, target: number, unit: string };
  customerSatisfaction: { score: number, target: number };
  // New Fields
  hourlyVolume: { hours: string[], values: number[] };
  popularCategories: { labels: string[], values: number[] };
  customerGrowth: { total: number, percentage: number, trend: 'up' | 'down' };
  recentReports: { name: string, period: string, generatedAt: string, format: 'PDF' | 'CSV' }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private supabase = inject(SupabaseService).supabaseClient;
  private storeService = inject(StoreService);

  constructor() { }

  getAnalyticsData(period: '7d' | '30d' | 'month' | 'all'): Observable<AnalyticsData> {
    const { startDate, endDate } = this.getDateRange(period);

    return this.storeService.currentStore$.pipe(
      switchMap(store => {
        if (!store) throw new Error('Loja não encontrada');

        return from(this.supabase.rpc('get_sales_report', {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          store_id_param: store.id
        }));
      }),
      map(({ data, error }) => {
        if (error) throw error;
        return this.mapRpcToAnalytics(data, period);
      }),
      catchError(err => {
        console.error('Erro ao buscar analytics:', err);
        throw err;
      })
    );
  }

  private getDateRange(period: string): { startDate: Date, endDate: Date } {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case '7d': start.setDate(end.getDate() - 7); break;
      case '30d': start.setDate(end.getDate() - 30); break;
      case 'month': start.setDate(1); break; // First day of current month
      case 'all': start.setFullYear(2020); break; // Far past
    }
    return { startDate: start, endDate: end };
  }

  private mapRpcToAnalytics(rpcData: any, period: string): AnalyticsData {
    const kpis = rpcData.kpis || {};
    const history = rpcData.sales_history || [];
    const categories = rpcData.category_sales || [];
    const ops = rpcData.operational_kpis || {};

    return {
      period: this.getPeriodLabel(period),
      totalRevenue: kpis.total_revenue || 0,
      totalOrders: kpis.total_orders || 0,
      avgTicket: kpis.avg_ticket || 0,
      cancelRate: 0, // Not implemented in RPC yet
      revenueChart: {
        labels: history.map((h: any) => h.day), // Format date if needed
        data: history.map((h: any) => h.revenue)
      },
      topProducts: [], // Not in RPC yet, optional
      prepTime: { current: ops.avg_prep_time || 0, target: 20, unit: 'min' },
      customerSatisfaction: { score: ops.avg_rating || 0, target: 5.0 },
      hourlyVolume: { hours: [], values: [] }, // Not in RPC yet
      popularCategories: {
        labels: categories.map((c: any) => c.category_name || c.category),
        values: categories.map((c: any) => c.total_sales) // Should be percentage? Component expects values.
      },
      customerGrowth: { total: kpis.new_customers || 0, percentage: 0, trend: 'up' }, // Percentage not calculated
      recentReports: []
    };
  }

  private getPeriodLabel(period: string): string {
    switch (period) {
      case '7d': return 'Últimos 7 Dias';
      case '30d': return 'Últimos 30 Dias';
      case 'month': return 'Este Mês';
      default: return 'Geral';
    }
  }
}
