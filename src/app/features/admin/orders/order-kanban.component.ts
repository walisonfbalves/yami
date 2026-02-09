import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';

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
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col font-display bg-background-dark overflow-hidden">
        <!-- Header -->
        <header class="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-surface-dark/50 backdrop-blur-md z-10 shrink-0">
            <h1 class="text-2xl font-heading font-bold text-white tracking-tight flex items-center gap-3">
                <span class="material-symbols-outlined text-primary">shopping_cart</span>
                Pedidos em Tempo Real
            </h1>
            <div class="flex items-center gap-4">
                 <div class="px-4 py-2 rounded-xl bg-surface-dark border border-white/5 text-sm text-gray-400">
                    <span class="text-white font-bold">{{ orders.length }}</span> Pedidos Ativos
                 </div>
            </div>
        </header>

        <!-- Kanban Board -->
        <div class="flex-1 overflow-x-auto overflow-y-hidden p-8 custom-scrollbar">
            <div class="flex gap-6 h-full min-w-max">
                
                <!-- Column: Novos / Pendentes -->
                <div class="w-80 flex flex-col h-full bg-surface-dark/30 rounded-2xl border border-white/5 overflow-hidden">
                    <div class="p-4 border-b border-white/5 bg-yellow-500/10 flex items-center justify-between">
                        <h2 class="font-bold text-yellow-500 uppercase tracking-wider text-sm flex items-center gap-2">
                            <span class="material-symbols-outlined text-lg">notifications_active</span>
                            Novos
                        </h2>
                        <span class="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-2 py-0.5 rounded-full">{{ pendingOrders.length }}</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                         <div *ngFor="let order of pendingOrders" class="bg-surface-dark border border-white/5 rounded-xl p-4 hover:border-yellow-500/30 transition-all group animate-fade-in shadow-lg">
                            <div class="flex justify-between items-start mb-3">
                                <span class="text-xs font-bold text-gray-500">#{{ order.id }}</span>
                                <span [class]="getTimeBadgeClass(order.createdAt)" class="text-[10px] font-bold px-2 py-1 rounded-full border">
                                    {{ getElapsedTime(order.createdAt) }}
                                </span>
                            </div>
                            
                            <div class="flex items-center gap-3 mb-4">
                                <img [src]="order.customerAvatar" class="w-8 h-8 rounded-full object-cover border border-white/10" alt="Avatar">
                                <span class="text-sm font-bold text-white">{{ order.customerName }}</span>
                            </div>

                            <ul class="space-y-1 mb-4">
                                <li *ngFor="let item of order.items" class="text-xs text-gray-400 flex items-start gap-1">
                                    <span class="w-1 h-1 rounded-full bg-yellow-500 mt-1.5 shrink-0"></span>
                                    {{ item }}
                                </li>
                            </ul>

                            <div class="flex items-center justify-between pt-3 border-t border-white/5">
                                <span class="font-bold text-white">{{ order.total | currency:'BRL' }}</span>
                                <button (click)="updateStatus(order.id, 'PREPARING')" class="px-4 py-2 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black font-bold rounded-lg text-xs transition-all flex items-center gap-1">
                                    Aceitar
                                    <span class="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Column: Em Preparo -->
                <div class="w-80 flex flex-col h-full bg-surface-dark/30 rounded-2xl border border-white/5 overflow-hidden">
                    <div class="p-4 border-b border-white/5 bg-orange-500/10 flex items-center justify-between">
                         <h2 class="font-bold text-orange-500 uppercase tracking-wider text-sm flex items-center gap-2">
                            <span class="material-symbols-outlined text-lg">local_fire_department</span>
                            Em Preparo
                        </h2>
                        <span class="bg-orange-500/20 text-orange-500 text-xs font-bold px-2 py-0.5 rounded-full">{{ preparingOrders.length }}</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                         <div *ngFor="let order of preparingOrders" class="bg-surface-dark border border-white/5 rounded-xl p-4 hover:border-orange-500/30 transition-all group animate-fade-in shadow-lg">
                            <div class="flex justify-between items-start mb-3">
                                <span class="text-xs font-bold text-gray-500">#{{ order.id }}</span>
                                <span [class]="getTimeBadgeClass(order.createdAt)" class="text-[10px] font-bold px-2 py-1 rounded-full border">
                                    {{ getElapsedTime(order.createdAt) }}
                                </span>
                            </div>
                            
                            <div class="flex items-center gap-3 mb-4">
                                <img [src]="order.customerAvatar" class="w-8 h-8 rounded-full object-cover border border-white/10" alt="Avatar">
                                <span class="text-sm font-bold text-white">{{ order.customerName }}</span>
                            </div>

                            <ul class="space-y-1 mb-4">
                                <li *ngFor="let item of order.items" class="text-xs text-gray-400 flex items-start gap-1">
                                    <span class="w-1 h-1 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
                                    {{ item }}
                                </li>
                            </ul>

                            <div class="flex items-center justify-between pt-3 border-t border-white/5">
                                <span class="font-bold text-white">{{ order.total | currency:'BRL' }}</span>
                                <button (click)="updateStatus(order.id, 'READY')" class="px-4 py-2 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1">
                                    Pronto
                                    <span class="material-symbols-outlined text-sm">check</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Column: Pronto -->
                <div class="w-80 flex flex-col h-full bg-surface-dark/30 rounded-2xl border border-white/5 overflow-hidden">
                    <div class="p-4 border-b border-white/5 bg-emerald-500/10 flex items-center justify-between">
                         <h2 class="font-bold text-emerald-500 uppercase tracking-wider text-sm flex items-center gap-2">
                            <span class="material-symbols-outlined text-lg">two_wheeler</span>
                            Pronto / Aguardando
                        </h2>
                        <span class="bg-emerald-500/20 text-emerald-500 text-xs font-bold px-2 py-0.5 rounded-full">{{ readyOrders.length }}</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        <div *ngFor="let order of readyOrders" class="bg-surface-dark border border-white/5 rounded-xl p-4 hover:border-emerald-500/30 transition-all group animate-fade-in shadow-lg">
                            <div class="flex justify-between items-start mb-3">
                                <span class="text-xs font-bold text-gray-500">#{{ order.id }}</span>
                                <span [class]="getTimeBadgeClass(order.createdAt)" class="text-[10px] font-bold px-2 py-1 rounded-full border">
                                    {{ getElapsedTime(order.createdAt) }}
                                </span>
                            </div>
                            
                            <div class="flex items-center gap-3 mb-4">
                                <img [src]="order.customerAvatar" class="w-8 h-8 rounded-full object-cover border border-white/10" alt="Avatar">
                                <span class="text-sm font-bold text-white">{{ order.customerName }}</span>
                            </div>

                            <ul class="space-y-1 mb-4">
                                <li *ngFor="let item of order.items" class="text-xs text-gray-400 flex items-start gap-1">
                                    <span class="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                                    {{ item }}
                                </li>
                            </ul>

                            <div class="flex items-center justify-between pt-3 border-t border-white/5">
                                <span class="font-bold text-white">{{ order.total | currency:'BRL' }}</span>
                                <button (click)="updateStatus(order.id, 'DELIVERED')" class="px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white font-bold rounded-lg text-xs transition-all flex items-center gap-1">
                                    Despachar
                                    <span class="material-symbols-outlined text-sm">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Column: Histórico / Entregue -->
                <div class="w-80 flex flex-col h-full bg-surface-dark/30 rounded-2xl border border-white/5 overflow-hidden opacity-75">
                    <div class="p-4 border-b border-white/5 bg-stone-500/10 flex items-center justify-between">
                         <h2 class="font-bold text-stone-400 uppercase tracking-wider text-sm flex items-center gap-2">
                            <span class="material-symbols-outlined text-lg">history</span>
                            Entregues
                        </h2>
                        <span class="bg-stone-500/20 text-stone-400 text-xs font-bold px-2 py-0.5 rounded-full">{{ historyOrders.length }}</span>
                    </div>
                    <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                         <div *ngFor="let order of historyOrders" class="bg-surface-dark border border-white/5 rounded-xl p-4 transition-all group animate-fade-in grayscale hover:grayscale-0">
                            <div class="flex justify-between items-start mb-3">
                                <span class="text-xs font-bold text-gray-500">#{{ order.id }}</span>
                                <span class="text-[10px] font-bold px-2 py-1 rounded-full border border-stone-800 bg-stone-900 text-stone-500">
                                    Concluído
                                </span>
                            </div>
                            
                            <div class="flex items-center gap-3 mb-4">
                                <img [src]="order.customerAvatar" class="w-8 h-8 rounded-full object-cover border border-white/10" alt="Avatar">
                                <span class="text-sm font-bold text-white">{{ order.customerName }}</span>
                            </div>
                             <div class="flex items-center justify-between pt-3 border-t border-white/5">
                                <span class="font-bold text-white">{{ order.total | currency:'BRL' }}</span>
                                <span class="text-xs text-stone-500">Há {{ getElapsedTime(order.createdAt) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class OrderKanbanComponent {
  orders: Order[] = [
    {
      id: '1024',
      customerName: 'Alice Silva',
      customerAvatar: 'https://i.pravatar.cc/150?u=alice',
      items: ['2x X-Bacon', '1x Coca-Cola Zero'],
      total: 54.00,
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1000 * 60 * 5) // 5 min ago
    },
    {
      id: '1023',
      customerName: 'Bruno Souza',
      customerAvatar: 'https://i.pravatar.cc/150?u=bruno',
      items: ['1x Miso Ramen', '1x Gyoza'],
      total: 42.50,
      status: 'PENDING',
      createdAt: new Date(Date.now() - 1000 * 60 * 25) // 25 min ago (Warning)
    },
    {
      id: '1022',
      customerName: 'Carla Dias',
      customerAvatar: 'https://i.pravatar.cc/150?u=carla',
      items: ['1x Truffle Burger', '1x Batata Rústica'],
      total: 68.00,
      status: 'PREPARING',
      createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 min ago
    },
    {
      id: '1021',
      customerName: 'Daniel Rocha',
      customerAvatar: 'https://i.pravatar.cc/150?u=daniel',
      items: ['3x Smash Burger'],
      total: 45.00,
      status: 'READY',
      createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
    },
     {
      id: '1020',
      customerName: 'Eduardo Lima',
      customerAvatar: 'https://i.pravatar.cc/150?u=eduardo',
      items: ['1x Combo Família'],
      total: 120.00,
      status: 'DELIVERED',
      createdAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
    }
  ];

  get pendingOrders() { return this.orders.filter(o => o.status === 'PENDING'); }
  get preparingOrders() { return this.orders.filter(o => o.status === 'PREPARING'); }
  get readyOrders() { return this.orders.filter(o => o.status === 'READY'); }
  get historyOrders() { return this.orders.filter(o => o.status === 'DELIVERED'); }

  updateStatus(id: string, newStatus: OrderStatus) {
    const order = this.orders.find(o => o.id === id);
    if (order) {
      order.status = newStatus;
      // In a real app, we would make an API call here.
    }
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
