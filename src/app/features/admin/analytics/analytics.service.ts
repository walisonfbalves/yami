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
          ],
          prepTime: { current: 14, target: 10, unit: 'min' },
          customerSatisfaction: { score: 4.8, target: 5.0 },
          hourlyVolume: {
            hours: ['10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h'],
            values: [12, 25, 60, 55, 30, 25, 20, 35, 70, 95, 110, 85, 40]
          },
          popularCategories: {
            labels: ['Burgers', 'Bebidas', 'Acompanhamen.'],
            values: [42, 28, 30]
          },
          customerGrowth: { total: 128, percentage: 12.5, trend: 'up' },
          recentReports: [
            { name: 'Vendas Semanais', period: '01/02 - 07/02', generatedAt: 'Hoje, 09:00', format: 'PDF' },
            { name: 'Performance Entregadores', period: 'Jan 2026', generatedAt: 'Ontem, 18:30', format: 'CSV' },
             { name: 'Transações Financeiras', period: 'Fev 2026', generatedAt: '05/02, 14:15', format: 'CSV' }
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
          ],
          prepTime: { current: 12, target: 10, unit: 'min' },
          customerSatisfaction: { score: 4.9, target: 5.0 },
          hourlyVolume: {
            hours: ['10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h'],
             values: [15, 32, 75, 68, 42, 35, 28, 45, 85, 120, 145, 100, 55]
          },
          popularCategories: {
            labels: ['Burgers', 'Bebidas', 'Acompanhamen.'],
             values: [45, 25, 30]
          },
          customerGrowth: { total: 450, percentage: 8.4, trend: 'up' },
           recentReports: [
            { name: 'Fechamento Mensal', period: 'Jan 2026', generatedAt: '01/02, 08:00', format: 'PDF' },
            { name: 'Vendas por Categoria', period: 'Jan 2026', generatedAt: '01/02, 08:05', format: 'CSV' },
            { name: 'Cancelamentos', period: 'Jan 2026', generatedAt: '02/02, 10:00', format: 'PDF' }
          ]
        };
        break;
    }

    return of(data).pipe(delay(800)); // Simulate API delay
  }
}
