import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '@core/services/order.service';
import { OrderCardComponent } from '../order-card/order-card.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'yami-order-board',
  standalone: true,
  imports: [CommonModule, OrderCardComponent],
  template: `
    <div class="p-6 h-full overflow-hidden flex flex-col">
      <h1 class="text-3xl font-heading font-bold text-text-primary mb-6">Gestão de Pedidos</h1>
      
      <div class="flex gap-6 overflow-x-auto h-full pb-4 items-start">
        
        <!-- Coluna: Pendente -->
        <div class="flex-1 min-w-[300px] bg-surface-hover rounded-xl p-4 h-full flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-heading font-bold text-text-primary text-lg">Novos</h3>
            <span class="bg-amber-500 text-stone-900 text-xs font-bold px-2 py-1 rounded-full">
              {{ (pendingOrders$ | async)?.length || 0 }}
            </span>
          </div>
          <div class="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            <yami-order-card 
              *ngFor="let order of pendingOrders$ | async" 
              [order]="order" 
              (updateStatus)="updateStatus(order.id, $event)">
            </yami-order-card>
            <div *ngIf="(pendingOrders$ | async)?.length === 0" class="text-center py-8 text-text-secondary opacity-50">
              <span class="material-symbols-outlined text-4xl mb-2">inbox</span>
              <p>Nenhum pedido novo</p>
            </div>
          </div>
        </div>

        <!-- Coluna: Preparando -->
        <div class="flex-1 min-w-[300px] bg-surface-hover rounded-xl p-4 h-full flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-heading font-bold text-text-primary text-lg">Preparando</h3>
            <span class="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {{ (preparingOrders$ | async)?.length || 0 }}
            </span>
          </div>
          <div class="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            <yami-order-card 
              *ngFor="let order of preparingOrders$ | async" 
              [order]="order" 
              (updateStatus)="updateStatus(order.id, $event)">
            </yami-order-card>
          </div>
        </div>

        <!-- Coluna: Pronto -->
        <div class="flex-1 min-w-[300px] bg-surface-hover rounded-xl p-4 h-full flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-heading font-bold text-text-primary text-lg">Pronto</h3>
            <span class="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {{ (readyOrders$ | async)?.length || 0 }}
            </span>
          </div>
          <div class="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            <yami-order-card 
              *ngFor="let order of readyOrders$ | async" 
              [order]="order" 
              (updateStatus)="updateStatus(order.id, $event)">
            </yami-order-card>
          </div>
        </div>

        <!-- Coluna: Entrega -->
        <div class="flex-1 min-w-[300px] bg-surface-hover rounded-xl p-4 h-full flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-heading font-bold text-text-primary text-lg">Em Entrega</h3>
            <span class="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {{ (deliveringOrders$ | async)?.length || 0 }}
            </span>
          </div>
          <div class="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            <yami-order-card 
              *ngFor="let order of deliveringOrders$ | async" 
              [order]="order" 
              (updateStatus)="updateStatus(order.id, $event)">
            </yami-order-card>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #44403c; border-radius: 20px; }
  `]
})
export class OrderBoardComponent implements OnInit {
  private orderService = inject(OrderService);

  pendingOrders$: Observable<Order[]>;
  preparingOrders$: Observable<Order[]>;
  readyOrders$: Observable<Order[]>;
  deliveringOrders$: Observable<Order[]>;

  constructor() {
    this.pendingOrders$ = this.orderService.activeOrders$.pipe(
      map(orders => orders.filter(o => o.status === 'pending'))
    );
    this.preparingOrders$ = this.orderService.activeOrders$.pipe(
      map(orders => orders.filter(o => o.status === 'preparing'))
    );
    this.readyOrders$ = this.orderService.activeOrders$.pipe(
      map(orders => orders.filter(o => o.status === 'ready'))
    );
    this.deliveringOrders$ = this.orderService.activeOrders$.pipe(
      map(orders => orders.filter(o => o.status === 'delivering'))
    );
  }

  ngOnInit(): void {
    // Service já inicia fetch/subscribe no construtor
  }

  updateStatus(orderId: string, status: Order['status']) {
    this.orderService.updateOrderStatus(orderId, status).subscribe();
  }
}
