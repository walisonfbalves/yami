export interface DashboardMetrics {
  total_orders: number;
  total_revenue: number;
  avg_ticket: number;
  on_time_rate: number;
  avg_prep_time: number;
  prev_total_orders: number;
  prev_total_revenue: number;
  orders_delta: number;
  orders_trend_pct: number;
  revenue_trend_pct: number;
}

export interface HourlyDataPoint {
  hour: number;
  count: number;
}

export interface ChartData {
  today: HourlyDataPoint[];
  yesterday: HourlyDataPoint[];
}
