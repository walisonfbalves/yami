import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '@core/services/order.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { BadgeComponent } from '@shared/ui/badge/badge.component';

@Component({
  selector: 'yami-order-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent],
  template: `
    <div class="bg-surface border border-surface-border rounded-xl p-4 shadow-sm hover:border-primary/50 transition-all group">
      <!-- Header -->
      <div class="flex justify-between items-start mb-3">
        <div>
          <h4 class="font-heading font-bold text-text-primary text-lg">#{{ order.id.slice(0, 4) }}</h4>
          <p class="text-sm text-text-secondary font-medium">{{ order.customer_name || 'Cliente' }}</p>
        </div>
        <ui-badge [variant]="getBadgeVariant(order.status)">
          {{ getStatusLabel(order.status) }}
        </ui-badge>
      </div>

      <!-- Items Summary -->
      <div class="space-y-2 mb-4">
        <div *ngFor="let item of order.items" class="flex justify-between text-sm">
          <span class="text-text-primary">
            <span class="font-bold text-primary">{{ item.quantity }}x</span> {{ item.product?.name }}
          </span>
        </div>
        <div *ngIf="!order.items?.length" class="text-text-secondary text-sm italic">
          Detalhes indisponíveis
        </div>
      </div>

      <!-- Footer / Actions -->
      <div class="pt-3 border-t border-surface-border flex items-center justify-between">
        <span class="font-bold text-text-primary">{{ order.total_amount | currency:'BRL':'symbol':'1.2-2' }}</span>
        
        <div class="flex gap-2">
            <!-- Ações baseadas no status -->
            <ng-container [ngSwitch]="order.status">
                <ui-button *ngSwitchCase="'pending'" variant="primary" size="sm" (click)="updateStatus.emit('preparing')">
                    Aceitar
                </ui-button>
                <ui-button *ngSwitchCase="'preparing'" variant="secondary" size="sm" (click)="updateStatus.emit('ready')">
                    Pronto
                </ui-button>
                <ui-button *ngSwitchCase="'ready'" variant="primary" size="sm" (click)="updateStatus.emit('delivering')">
                    Despachar
                </ui-button>
                <ui-button *ngSwitchCase="'delivering'" variant="secondary" size="sm" (click)="updateStatus.emit('delivered')">
                    Concluir
                </ui-button>
            </ng-container>
        </div>
      </div>
      
      <!-- Time Elapsed (Mocked for now) -->
      <div class="mt-2 text-xs text-text-secondary font-medium flex items-center gap-1">
        <span class="material-symbols-outlined text-[14px]">schedule</span>
        Há {{ getTimeElapsed(order.created_at) }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderCardComponent {
  @Input() order!: Order;
  @Output() updateStatus = new EventEmitter<Order['status']>();

  getBadgeVariant(status: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
    switch (status) {
      case 'pending': return 'warning';
      case 'preparing': return 'info';
      case 'ready': return 'success';
      case 'delivering': return 'info';
      default: return 'default';
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      preparing: 'Preparando',
      ready: 'Pronto',
      delivering: 'Em Entrega',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  }

  getTimeElapsed(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  }
}
