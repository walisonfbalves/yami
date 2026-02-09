import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface AnalyticsData {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  avgTicket: number;
  cancelRate: number;
  revenueChart: { labels: string[], data: number[] };
  topProducts: { rank: number, name: string, quantity: number, revenue: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  getAnalyticsData(period: '7d' | '30d' | 'month' | 'all'): Observable<AnalyticsData> {
    // Mock data based on period
    let data: AnalyticsData;

    switch (period) {
      case '7d':
        data = {
          period: 'Últimos 7 Dias',
          totalRevenue: 12500.00,
          totalOrders: 345,
          avgTicket: 36.23,
          cancelRate: 1.8,
          revenueChart: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            data: [1200, 1500, 1100, 1800, 2500, 2900, 1500]
          },
          topProducts: [
            { rank: 1, name: 'X-Bacon', quantity: 120, revenue: 3600 },
            { rank: 2, name: 'Coca-Cola Zero', quantity: 98, revenue: 588 },
            { rank: 3, name: 'Batata Rústica', quantity: 85, revenue: 1275 }
          ]
        };
        break;
      case '30d':
      default:
        data = {
          period: 'Últimos 30 Dias',
          totalRevenue: 45200.00,
          totalOrders: 1250,
          avgTicket: 36.16,
          cancelRate: 2.4,
          revenueChart: {
            labels: Array.from({length: 30}, (_, i) => `Dia ${i+1}`),
            data: Array.from({length: 30}, () => Math.floor(Math.random() * 2000) + 1000)
          },
          topProducts: [
            { rank: 1, name: 'X-Bacon', quantity: 450, revenue: 13500 },
            { rank: 2, name: 'Truffle Burger', quantity: 320, revenue: 12800 },
            { rank: 3, name: 'Combo Família', quantity: 150, revenue: 18000 }
          ]
        };
        break;
    }

    return of(data).pipe(delay(800)); // Simulate API delay
  }
}
