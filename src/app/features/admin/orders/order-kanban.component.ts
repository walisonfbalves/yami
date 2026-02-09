import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

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
  imports: [CommonModule, DragDropModule],
  templateUrl: './order-kanban.component.html',
  styleUrls: ['./order-kanban.component.css']
})
export class OrderKanbanComponent {
  
  pendingOrders: Order[] = [];
  preparingOrders: Order[] = [];
  readyOrders: Order[] = [];
  outForDeliveryOrders: Order[] = [];
  historyOrders: Order[] = [];

  constructor() {
    this.initializeMockData();
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
}
