import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OrderDetailsModalComponent } from './components/order-details-modal/order-details-modal.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { DialogComponent } from '../../../shared/ui/dialog/dialog.component';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface Order {
  id: string;
  customerName: string;
  customerAvatar: string;
  items: string[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

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
    IconComponent,
    DialogComponent
  ],
  templateUrl: './order-kanban.component.html',
  styleUrls: ['./order-kanban.component.css']
})
export class OrderKanbanComponent {
  
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

  constructor() {
    this.initializeMockData();
  }

  toggleView(mode: 'kanban' | 'grid') {
    this.viewMode = mode;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  get kdsOrders(): Order[] {
    // Combine active orders for KDS (Pending, Preparing, Ready)
    // Exclude 'OUT_FOR_DELIVERY' and 'DELIVERED' from Kitchen View usually, unless configured otherwise.
    // For this requirement, we'll show Pending -> Preparing -> Ready.
    let orders = [
        ...this.pendingOrders,
        ...this.preparingOrders,
        ...this.readyOrders
    ];

    // Mock Category Filtering
    if (this.selectedCategory !== 'Todas') {
        // In a real app, orders would have categories. 
        // Here we just mock filter to show it works visually if we had data
        // orders = orders.filter(o => o.items.some(i => i.includes(this.selectedCategory)));
    }

    // Sort by creation time (Oldest first for KDS)
    return orders.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  advanceOrderStatus(order: Order) {
    let newStatus: OrderStatus | null = null;

    switch (order.status) {
        case 'PENDING':
            newStatus = 'PREPARING';
            break;
        case 'PREPARING':
            newStatus = 'READY';
            break;
        case 'READY':
            newStatus = 'OUT_FOR_DELIVERY';
            break;
        default:
            return;
    }

    if (newStatus) {
        // Remove from current list
        this.removeFromCurrentList(order);
        
        // Update status and add to new list
        order.status = newStatus;
        this.addToList(order, newStatus);
        
        console.log(`[KDS] Order ${order.id} advanced to ${newStatus}`);
    }
  }

  private removeFromCurrentList(order: Order) {
      this.pendingOrders = this.pendingOrders.filter(o => o.id !== order.id);
      this.preparingOrders = this.preparingOrders.filter(o => o.id !== order.id);
      this.readyOrders = this.readyOrders.filter(o => o.id !== order.id);
      this.outForDeliveryOrders = this.outForDeliveryOrders.filter(o => o.id !== order.id);
  }

  private addToList(order: Order, status: OrderStatus) {
      switch (status) {
          case 'PENDING': this.pendingOrders.push(order); break;
          case 'PREPARING': this.preparingOrders.push(order); break;
          case 'READY': this.readyOrders.push(order); break;
          case 'OUT_FOR_DELIVERY': this.outForDeliveryOrders.push(order); break;
          case 'DELIVERED': this.historyOrders.push(order); break;
      }
  }

  getKdsColorInfo(order: Order): { bg: string, text: string, btnBg: string, btnText: string, label: string } {
      const elapsed = this.getElapsedTimeMinutes(order.createdAt);
      
      // Delayed check (> 20 min)
      if (elapsed > 20 && order.status !== 'READY') {
          return {
              bg: 'bg-red-600',
              text: 'text-white',
              btnBg: 'bg-red-600',
              btnText: 'ATRASADO',
              label: 'ATRASADO'
          };
      }

      switch (order.status) {
          case 'PENDING':
              return { bg: 'bg-amber-500', text: 'text-black', btnBg: 'bg-amber-500', btnText: 'ACEITAR PEDIDO', label: 'NOVO' };
          case 'PREPARING':
              return { bg: 'bg-orange-500', text: 'text-black', btnBg: 'bg-orange-500', btnText: 'PRONTO', label: 'PREPARO' };
          case 'READY':
              return { bg: 'bg-emerald-500', text: 'text-white', btnBg: 'bg-emerald-500', btnText: 'DESPACHAR', label: 'PRONTO' };
          default:
              return { bg: 'bg-stone-700', text: 'text-white', btnBg: 'bg-stone-700', btnText: 'VER', label: order.status };
      }
  }

  getElapsedTimeMinutes(date: Date): number {
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
  }

  get formattedTimer(): string {
      // Logic to return a timer string like "04:12" would go here.
      // For now we use static elapsed time text, or we could implement a ticker.
      // We'll trust the template to use `getElapsedTime` for now or a simple format.
      return "00:00"; 
  }
  
  drop(event: CdkDragDrop<Order[]>, newStatus: OrderStatus) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const movedOrder = event.container.data[event.currentIndex];
      movedOrder.status = newStatus;
      
      console.log(`Order ${movedOrder.id} moved to ${newStatus}`);
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
          this.removeFromCurrentList(this.orderToCancel);
          this.historyOrders = this.historyOrders.filter(o => o.id !== this.orderToCancel!.id);
          console.log(`Order ${this.orderToCancel.id} cancelled`);
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

  initializeMockData() {
      const allOrders: Order[] = [
        {
            id: '1024',
            customerName: 'Alice Silva',
            customerAvatar: 'https://i.pravatar.cc/150?u=alice',
            items: ['2x X-Bacon', '1x Coca-Cola Zero'],
            total: 54.00,
            status: 'PENDING',
            createdAt: new Date(Date.now() - 1000 * 60 * 5)
        },
        {
            id: '1023',
            customerName: 'Bruno Souza',
            customerAvatar: 'https://i.pravatar.cc/150?u=bruno',
            items: ['1x Miso Ramen', '1x Gyoza'],
            total: 42.50,
            status: 'PENDING',
            createdAt: new Date(Date.now() - 1000 * 60 * 25)
        },
        {
            id: '1022',
            customerName: 'Carla Dias',
            customerAvatar: 'https://i.pravatar.cc/150?u=carla',
            items: ['1x Truffle Burger', '1x Batata Rústica'],
            total: 68.00,
            status: 'PREPARING',
            createdAt: new Date(Date.now() - 1000 * 60 * 15)
        },
        {
            id: '1021',
            customerName: 'Daniel Rocha',
            customerAvatar: 'https://i.pravatar.cc/150?u=daniel',
            items: ['3x Smash Burger'],
            total: 45.00,
            status: 'READY',
            createdAt: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
            id: '1019',
            customerName: 'Fernando Costa',
            customerAvatar: 'https://i.pravatar.cc/150?u=fernando',
            items: ['1x Pizza G', '2x Guaraná'],
            total: 89.90,
            status: 'OUT_FOR_DELIVERY',
            createdAt: new Date(Date.now() - 1000 * 60 * 45)
        },
        {
            id: '1020',
            customerName: 'Eduardo Lima',
            customerAvatar: 'https://i.pravatar.cc/150?u=eduardo',
            items: ['1x Combo Família'],
            total: 120.00,
            status: 'DELIVERED',
            createdAt: new Date(Date.now() - 1000 * 60 * 60)
        }
      ];

      this.pendingOrders = allOrders.filter(o => o.status === 'PENDING');
      this.preparingOrders = allOrders.filter(o => o.status === 'PREPARING');
      this.readyOrders = allOrders.filter(o => o.status === 'READY');
      this.outForDeliveryOrders = allOrders.filter(o => o.status === 'OUT_FOR_DELIVERY');
      this.historyOrders = allOrders.filter(o => o.status === 'DELIVERED');
  }

  getElapsedTime(date: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // minutes
    
    if (diff < 1) return 'agora mesmo';
    if (diff < 60) return `há ${diff} min`;
    const hours = Math.floor(diff / 60);
    return `há ${hours}h`;
  }

  getTimeBadgeClass(date: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // minutes

    if (diff > 20) {
        return 'bg-red-500/10 text-red-500 border-red-500/30';
    }
    return 'bg-stone-500/10 text-stone-400 border-stone-500/30';
  }

  getTimeBadgeVariant(date: Date): 'neutral' | 'danger' {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    return diff > 20 ? 'danger' : 'neutral';
  }
}
