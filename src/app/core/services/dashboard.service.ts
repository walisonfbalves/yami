import { Injectable, inject } from '@angular/core';
import { from, Observable, combineLatest, of } from 'rxjs';
import { map, catchError, switchMap, filter, startWith } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { StoreService } from './store.service';
import { DashboardMetrics, ChartData } from '../../features/admin/dashboard/dashboard.models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private supabase = inject(SupabaseService).supabaseClient;
  private storeService = inject(StoreService);

  getMetrics(startAt: Date, endAt: Date): Observable<DashboardMetrics> {
    return this.storeService.currentStore$.pipe(
      filter(store => store !== undefined && store !== null),
      switchMap(store => {
        const call = this.supabase.rpc('get_dashboard_metrics', {
          p_store_id: store!.id,
          p_start_at: startAt.toISOString(),
          p_end_at: endAt.toISOString()
        });
        return from(call).pipe(
          map(({ data, error }) => {
            if (error) throw error;
            return data as DashboardMetrics;
          })
        );
      })
    );
  }

  getChartData(date: Date): Observable<ChartData> {
    const dateStr = date.toLocaleDateString('en-CA');
    return this.storeService.currentStore$.pipe(
      filter(store => store !== undefined && store !== null),
      switchMap(store => {
        const call = this.supabase.rpc('get_orders_chart_data', {
          p_store_id: store!.id,
          p_date: dateStr
        });
        return from(call).pipe(
          map(({ data, error }) => {
            if (error) throw error;
            return data as ChartData;
          })
        );
      })
    );
  }

  getDashboardData(startAt: Date, endAt: Date, today: Date): Observable<{ metrics: DashboardMetrics; chart: ChartData }> {
    const zeroed = {
      metrics: {
        total_orders: 0, total_revenue: 0, avg_ticket: 0,
        on_time_rate: 0, avg_prep_time: 0, prev_total_orders: 0,
        prev_total_revenue: 0, orders_delta: 0,
        orders_trend_pct: 0, revenue_trend_pct: 0
      } as DashboardMetrics,
      chart: { today: [], yesterday: [] } as ChartData
    };

    return this.storeService.currentStore$.pipe(
      filter(store => store !== undefined && store !== null),
      switchMap(store => {
        const metricsCall = from(
          this.supabase.rpc('get_dashboard_metrics', {
            p_store_id: store!.id,
            p_start_at: startAt.toISOString(),
            p_end_at: endAt.toISOString()
          })
        );
        const chartCall = from(
          this.supabase.rpc('get_orders_chart_data', {
            p_store_id: store!.id,
            p_date: today.toLocaleDateString('en-CA')
          })
        );
        return combineLatest([metricsCall, chartCall]).pipe(
          map(([metricsRes, chartRes]) => {
            if (metricsRes.error) throw metricsRes.error;
            if (chartRes.error) throw chartRes.error;
            return {
              metrics: metricsRes.data as DashboardMetrics,
              chart: chartRes.data as ChartData
            };
          }),
          catchError(err => {
            console.error('DashboardService: erro ao buscar dados:', err);
            return of(zeroed);
          }),
          startWith(zeroed)
        );
      })
    );
  }
}
