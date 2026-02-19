import { Component, inject, OnInit, DestroyRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card.component';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardMetrics, ChartData, HourlyDataPoint } from './dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardComponent, MetricCardComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  readonly skeletonItems = [1, 2, 3];

  isLoading = signal(true);
  error = signal<string | null>(null);
  metrics = signal<DashboardMetrics | null>(null);
  chartData = signal<ChartData | null>(null);

  readonly ON_TIME_CIRCUMFERENCE = 125;
  readonly PREP_MAX_MINUTES = 30;
  readonly PEAK_MIN_ORDERS = 10;

  onTimeOffset = computed(() => {
    const rate = this.metrics()?.on_time_rate ?? 0;
    return this.ON_TIME_CIRCUMFERENCE - (rate / 100) * this.ON_TIME_CIRCUMFERENCE;
  });

  prepOffset = computed(() => {
    const avg = this.metrics()?.avg_prep_time ?? 0;
    const pct = Math.min(avg / this.PREP_MAX_MINUTES, 1);
    return this.ON_TIME_CIRCUMFERENCE - pct * this.ON_TIME_CIRCUMFERENCE;
  });

  todayPolyline = computed(() => this.buildPolyline(this.chartData()?.today ?? []));
  yesterdayPolyline = computed(() => this.buildPolyline(this.chartData()?.yesterday ?? []));
  todayAreaPath = computed(() => this.buildAreaPath(this.chartData()?.today ?? []));

  peakHour = computed(() => {
    const data = this.chartData()?.today ?? [];
    if (!data.length) return null;
    const peak = data.reduce((max, d) => d.count > max.count ? d : max, data[0]);
    return peak.count >= this.PEAK_MIN_ORDERS ? peak : null;
  });

  peakTooltipXPct = computed(() => {
    const peak = this.peakHour();
    if (!peak) return 0;
    return (peak.hour / 23) * 100;
  });

  peakTooltipY = computed(() => {
    const data = this.chartData()?.today ?? [];
    if (!data.length) return 70;
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const peak = this.peakHour();
    if (!peak) return 70;
    return Math.round(280 - (peak.count / maxCount) * 260);
  });

  peakTooltipYPct = computed(() => {
    const y = this.peakTooltipY();
    return (y / 300) * 100;
  });

  ordersTrend = computed(() => {
    const pct = this.metrics()?.orders_trend_pct ?? 0;
    return `${pct >= 0 ? '+' : ''}${pct}%`;
  });

  revenueTrend = computed(() => {
    const pct = this.metrics()?.revenue_trend_pct ?? 0;
    return `${pct >= 0 ? '+' : ''}${pct}%`;
  });

  ordersVariant = computed(() => {
    return (this.metrics()?.orders_trend_pct ?? 0) >= 0 ? 'orders' : 'cancelled';
  });

  ordersDeltaLabel = computed(() => {
    const delta = this.metrics()?.orders_delta ?? 0;
    return delta >= 0 ? `+${delta}` : `${delta}`;
  });

  ordersDeltaClass = computed(() => {
    const delta = this.metrics()?.orders_delta ?? 0;
    return delta >= 0 ? 'text-emerald-500 font-bold' : 'text-red-400 font-bold';
  });

  totalOrdersLabel = computed(() => {
    const v = this.metrics()?.total_orders ?? 0;
    return new Intl.NumberFormat('pt-BR').format(v);
  });

  totalRevenueLabel = computed(() => {
    const v = this.metrics()?.total_revenue ?? 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  });

  avgTicketLabel = computed(() => {
    const v = this.metrics()?.avg_ticket ?? 0;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  });

  onTimeRateLabel = computed(() => {
    const v = this.metrics()?.on_time_rate ?? 0;
    return `${v.toFixed(0)}%`;
  });

  avgPrepTimeLabel = computed(() => {
    const v = this.metrics()?.avg_prep_time ?? 0;
    return `${v.toFixed(1)}m`;
  });

  peakLabel = computed(() => {
    const peak = this.peakHour();
    if (!peak) return '';
    const hour = this.formatHour(peak.hour);
    const count = new Intl.NumberFormat('pt-BR').format(peak.count);
    return `${hour} · ${count} pedidos`;
  });

  ngOnInit(): void {
    const now = new Date();
    const startAt = new Date(now);
    startAt.setHours(0, 0, 0, 0);
    const endAt = new Date(now);
    endAt.setHours(23, 59, 59, 999);

    this.dashboardService.getDashboardData(startAt, endAt, now)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ metrics, chart }) => {
          this.metrics.set(metrics);
          this.chartData.set(chart);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Falha ao carregar dados do dashboard.');
          this.isLoading.set(false);
          console.error(err);
        }
      });
  }

  formatHour(hour: number): string {
    return `${String(hour).padStart(2, '0')}:00`;
  }

  private buildPolyline(data: HourlyDataPoint[]): string {
    if (!data.length) return '';
    const maxCount = Math.max(...data.map(d => d.count), 1);
    return data.map((d, i) => {
      const x = Math.round((i / 23) * 1000);
      const y = Math.round(280 - (d.count / maxCount) * 260);
      return `${x},${y}`;
    }).join(' ');
  }

  private buildAreaPath(data: HourlyDataPoint[]): string {
    if (!data.length) return '';
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const points = data.map((d, i) => {
      const x = Math.round((i / 23) * 1000);
      const y = Math.round(280 - (d.count / maxCount) * 260);
      return `${x},${y}`;
    });
    return `M0,280 L${points.join(' L')} L1000,280 Z`;
  }
}
