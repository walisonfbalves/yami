import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OrderDetailsModalComponent } from './components/order-details-modal/order-details-modal.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { DialogComponent } from '../../../shared/ui/dialog/dialog.component';
import { OrderService, Order } from '@core/services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-kanban',
  standalone: true,
  imports: [
    CommonModule, 
    DragDropModule, 
    OrderDetailsModalComponent,
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    DialogComponent
  ],
  templateUrl: './order-kanban.component.html',
  styleUrls: ['./order-kanban.component.css']
})
export class OrderKanbanComponent implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private subscription = new Subscription();
  
  pendingOrders: Order[] = [];
  preparingOrders: Order[] = [];
  readyOrders: Order[] = [];
  outForDeliveryOrders: Order[] = [];
  historyOrders: Order[] = [];

  selectedOrder: Order | null = null;
  showCancelModal = false;
  orderToCancel: Order | null = null;

  viewMode: 'kanban' | 'grid' = 'kanban';
  categories: string[] = ['Todas', 'Cozinha Quente', 'Bebidas', 'Sobremesas'];
  selectedCategory: string = 'Todas';

  ngOnInit() {
    this.subscription.add(
      this.orderService.activeOrders$.subscribe(orders => {
        this.pendingOrders = orders.filter(o => o.status === 'pending');
        this.preparingOrders = orders.filter(o => o.status === 'preparing');
        this.readyOrders = orders.filter(o => o.status === 'ready');
        this.outForDeliveryOrders = orders.filter(o => o.status === 'delivering');
        // History orders (delivered/cancelled) are generally removed from active list in service,
        // but if we want to show recent delivered ones, we might need a separate stream or logic.
        // For now, let's keep history empty or implement a separate fetch if needed.
        this.historyOrders = orders.filter(o => o.status === 'delivered');
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleView(mode: 'kanban' | 'grid') {
    this.viewMode = mode;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  get kdsOrders(): Order[] {
    let orders = [
        ...this.pendingOrders,
        ...this.preparingOrders,
        ...this.readyOrders
    ];

    // Mock Category Filtering (Real implementation would need category on items)
    if (this.selectedCategory !== 'Todas') {
         // orders = orders.filter(...)
    }

    return orders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  advanceOrderStatus(order: Order) {
    let newStatus: Order['status'] | null = null;

    switch (order.status) {
        case 'pending': newStatus = 'preparing'; break;
        case 'preparing': newStatus = 'ready'; break;
        case 'ready': newStatus = 'delivering'; break;
        case 'delivering': newStatus = 'delivered'; break;
        default: return;
    }

    if (newStatus) {
        this.orderService.updateOrderStatus(order.id, newStatus);
    }
  }

  getKdsColorInfo(order: Order): { bg: string, text: string, btnBg: string, btnText: string, label: string } {
      const elapsed = this.getElapsedTimeMinutes(order.created_at);
      
      if (elapsed > 20 && order.status !== 'ready') {
          return {
              bg: 'bg-red-600',
              text: 'text-white',
              btnBg: 'bg-red-600',
              btnText: 'ATRASADO',
              label: 'ATRASADO'
          };
      }

      switch (order.status) {
          case 'pending':
              return { bg: 'bg-amber-500', text: 'text-black', btnBg: 'bg-amber-500', btnText: 'ACEITAR PEDIDO', label: 'NOVO' };
          case 'preparing':
              return { bg: 'bg-orange-500', text: 'text-black', btnBg: 'bg-orange-500', btnText: 'PRONTO', label: 'PREPARO' };
          case 'ready':
              return { bg: 'bg-emerald-500', text: 'text-white', btnBg: 'bg-emerald-500', btnText: 'DESPACHAR', label: 'PRONTO' };
          default:
              return { bg: 'bg-stone-700', text: 'text-white', btnBg: 'bg-stone-700', btnText: 'VER', label: order.status };
      }
  }

  getElapsedTimeMinutes(dateStr: string): number {
    const date = new Date(dateStr);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
  }
  
  drop(event: CdkDragDrop<Order[]>, newStatusStr: string) {
    const newStatus = newStatusStr as Order['status'];

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedOrder = event.previousContainer.data[event.previousIndex];
      
      // Optimistic update visual
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Call service
      this.orderService.updateOrderStatus(movedOrder.id, newStatus);
    }
  }

  // --- Modal Handlers ---
  openOrderDetails(order: Order) {
      this.selectedOrder = order;
  }

  closeOrderDetails() {
      this.selectedOrder = null;
  }

  onCancelOrder(order: Order) {
      this.orderToCancel = order;
      this.showCancelModal = true;
  }

  executeCancelOrder() {
      if (this.orderToCancel) {
          this.orderService.updateOrderStatus(this.orderToCancel.id, 'cancelled');
          // Optimistic remove handled by service subscription
      }
      this.cancelCancelOrder();
      this.closeOrderDetails();
  }

  cancelCancelOrder() {
      this.showCancelModal = false;
      this.orderToCancel = null;
  }

  getTotalActiveOrders() {
      return this.pendingOrders.length + this.preparingOrders.length + this.readyOrders.length + this.outForDeliveryOrders.length;
  }

  getElapsedTime(dateStr: string): string {
    const diff = this.getElapsedTimeMinutes(dateStr);
    if (diff < 1) return 'agora mesmo';
    if (diff < 60) return `há ${diff} min`;
    const hours = Math.floor(diff / 60);
    return `há ${hours}h`;
  }

  getTimeBadgeVariant(dateStr: string): 'neutral' | 'danger' {
    const diff = this.getElapsedTimeMinutes(dateStr);
    return diff > 20 ? 'danger' : 'neutral';
  }
}
