import { Injectable, inject } from '@angular/core';
import { Observable, from, switchMap, map, catchError, throwError } from 'rxjs';
import { SupabaseService } from '../../../core/services/supabase.service';
import { StoreService } from '../../../core/services/store.service';

export interface TopProduct {
  rank: number;
  name: string;
  quantity: number;
}

export interface PaymentBreakdown {
  pix: number;
  cartao: number;
  dinheiro: number;
}

export interface AnalyticsData {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  avgTicket: number;
  revenueChart: { labels: string[]; data: number[] };
  hourlyVolume: { hours: string[]; values: number[] };
  topProducts: TopProduct[];
  paymentBreakdown: PaymentBreakdown;
  customerGrowth: { total: number; percentage: number; trend: 'up' | 'down' };
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private supabase = inject(SupabaseService).supabaseClient;
  private storeService = inject(StoreService);

  getAnalyticsData(period: '7d' | '30d' | 'month' | 'all'): Observable<AnalyticsData> {
    const startDate = this.getStartDate(period);

    return this.storeService.currentStore$.pipe(
      switchMap(store => {
        if (!store) return throwError(() => new Error('Loja não encontrada'));
        return from(this.fetchAllData(startDate));
      }),
      map(({ pedidos, itensPedido }) => this.processData(pedidos, itensPedido, period)),
      catchError(err => {
        console.error('Erro ao buscar analytics:', err);
        return throwError(() => err);
      })
    );
  }

  private getStartDate(period: string): Date {
    const start = new Date();
    switch (period) {
      case '7d': start.setDate(start.getDate() - 7); break;
      case '30d': start.setDate(start.getDate() - 30); break;
      case 'month': start.setDate(1); break;
      case 'all': start.setFullYear(2020); break;
    }
    return start;
  }

  private async fetchAllData(startDate: Date) {
    const [pedidosRes, itensRes] = await Promise.all([
      this.supabase
        .from('pedidos')
        .select('id, valor_total, forma_pagamento, criado_em')
        .gte('criado_em', startDate.toISOString()),
      this.supabase
        .from('itens_pedido')
        .select('produto_id, quantidade, produtos(nome)')
        .gte('criado_em', startDate.toISOString())
    ]);

    if (pedidosRes.error) throw pedidosRes.error;

    return {
      pedidos: (pedidosRes.data ?? []) as PedidoRow[],
      itensPedido: (itensRes.data ?? []) as ItemPedidoRow[]
    };
  }

  private processData(pedidos: PedidoRow[], itensPedido: ItemPedidoRow[], period: string): AnalyticsData {
    const totalRevenue = pedidos.reduce((sum, p) => sum + Number(p.valor_total), 0);
    const totalOrders = pedidos.length;
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const revenueByDay = new Map<string, number>();
    for (const p of pedidos) {
      const day = p.criado_em.slice(0, 10);
      revenueByDay.set(day, (revenueByDay.get(day) ?? 0) + Number(p.valor_total));
    }
    const sortedDays = [...revenueByDay.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    const revenueChart = {
      labels: sortedDays.map(([d]) => d),
      data: sortedDays.map(([, v]) => v)
    };

    const pedidosByHour = new Map<number, number>();
    for (const p of pedidos) {
      const hour = new Date(p.criado_em).getHours();
      pedidosByHour.set(hour, (pedidosByHour.get(hour) ?? 0) + 1);
    }
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const hourlyVolume = {
      hours: hours.map(h => `${String(h).padStart(2, '0')}h`),
      values: hours.map(h => pedidosByHour.get(h) ?? 0)
    };

    const paymentBreakdown: PaymentBreakdown = { pix: 0, cartao: 0, dinheiro: 0 };
    for (const p of pedidos) {
      const forma = p.forma_pagamento as keyof PaymentBreakdown;
      if (forma in paymentBreakdown) {
        paymentBreakdown[forma] += Number(p.valor_total);
      }
    }

    const productQty = new Map<string, { name: string; quantity: number }>();
    for (const item of itensPedido) {
      const nome = (item.produtos as any)?.nome ?? 'Desconhecido';
      const entry = productQty.get(item.produto_id) ?? { name: nome, quantity: 0 };
      entry.quantity += item.quantidade;
      productQty.set(item.produto_id, entry);
    }
    const topProducts: TopProduct[] = [...productQty.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map((p, i) => ({ rank: i + 1, name: p.name, quantity: p.quantity }));

    return {
      period: this.getPeriodLabel(period),
      totalRevenue,
      totalOrders,
      avgTicket,
      revenueChart,
      hourlyVolume,
      topProducts,
      paymentBreakdown,
      customerGrowth: { total: totalOrders, percentage: 0, trend: 'up' }
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

interface PedidoRow {
  id: string;
  valor_total: number;
  forma_pagamento: string;
  criado_em: string;
}

interface ItemPedidoRow {
  produto_id: string;
  quantidade: number;
  produtos: { nome: string } | { nome: string }[] | null;
}
