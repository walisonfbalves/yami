import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { StoreService } from './store.service';
import { 
  RealtimeChannel, 
  RealtimePostgresChangesPayload 
} from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap, tap, catchError, filter } from 'rxjs/operators';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  product?: {
    name: string;
    image_url?: string;
  };
}

export interface Order {
  id: string;
  store_id: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  customer_name?: string;
  delivery_address?: string;
  payment_method?: string;
  items?: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private supabase = inject(SupabaseService).supabaseClient;
  private storeService = inject(StoreService);

  private _activeOrders = new BehaviorSubject<Order[]>([]);
  readonly activeOrders$ = this._activeOrders.asObservable();
  
  private realtimeChannel: RealtimeChannel | null = null;

  constructor() {
    this.storeService.currentStore$.pipe(
      filter(store => !!store),
      switchMap(store => {
        // 1. Carregar pedidos ativos iniciais
        this.fetchActiveOrders(store!.id);
        
        // 2. Inscrever no Realtime
        return this.subscribeToOrders(store!.id);
      })
    ).subscribe();
  }

  private async fetchActiveOrders(storeId: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:products (name, image_url)
        )
      `)
      .eq('store_id', storeId)
      .in('status', ['pending', 'preparing', 'ready', 'delivering'])
      .order('created_at', { ascending: true });

    if (error) {
      console.error('OrderService: Erro ao buscar pedidos', error);
      return;
    }

    this._activeOrders.next(data as Order[]);
  }

  private subscribeToOrders(storeId: string): Observable<any> {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }

    this.realtimeChannel = this.supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `store_id=eq.${storeId}`
        },
        (payload: RealtimePostgresChangesPayload<Order>) => {
          this.handleRealtimeEvent(payload);
        }
      )
      .subscribe();

    return of(true);
  }

  private handleRealtimeEvent(payload: RealtimePostgresChangesPayload<Order>) {
    const currentOrders = this._activeOrders.value;
    const { eventType, new: newRecord, old: oldRecord } = payload;

    if (eventType === 'INSERT') {
      // Novo pedido!
      this.playNotificationSound();
      // O payload INSERT não traz os items (joins), então precisamos buscar o pedido completo
      // Mas para UI instantânea, podemos adicionar o pedido incompleto e revalidar depois
      this.fetchOrderDetails(newRecord.id).then(order => {
        if (order) {
           this._activeOrders.next([...this._activeOrders.value, order]);
        }
      });
    } else if (eventType === 'UPDATE') {
      const updatedOrder = newRecord as Order;
      // Se status finalizado, remove da lista
      if (['delivered', 'cancelled'].includes(updatedOrder.status)) {
        this._activeOrders.next(currentOrders.filter(o => o.id !== updatedOrder.id));
      } else {
        // Atualiza na lista mantendo os items originais se não vierem no payload (provável)
        this._activeOrders.next(currentOrders.map(o => 
          o.id === updatedOrder.id ? { ...o, ...updatedOrder, items: o.items } : o
        ));
      }
    } else if (eventType === 'DELETE') {
      this._activeOrders.next(currentOrders.filter(o => o.id !== oldRecord.id));
    }
  }

  // Busca detalhes completos de um pedido único (útil após INSERT)
  private async fetchOrderDetails(orderId: string): Promise<Order | null> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          *,
          product:products (name, image_url)
        )
      `)
      .eq('id', orderId)
      .single();
    
    return error ? null : (data as Order);
  }

  updateOrderStatus(orderId: string, status: Order['status']) {
    // Optimistic Update
    const currentOrders = this._activeOrders.value;
    const optimisticOrders = currentOrders.map(o => 
      o.id === orderId ? { ...o, status } : o
    ).filter(o => !['delivered', 'cancelled'].includes(status) || o.id !== orderId); // Remove se finalizado

    this._activeOrders.next(optimisticOrders);

    return from(
      this.supabase.from('orders').update({ status }).eq('id', orderId)
    ).pipe(
      tap(({ error }) => {
        if (error) {
          // Rollback em caso de erro
          console.error('Erro ao atualizar status', error);
          this._activeOrders.next(currentOrders);
        }
      })
    );
  }

  private playNotificationSound() {
    const audio = new Audio('assets/sounds/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed', e));
  }
}
