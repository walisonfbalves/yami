import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '@core/services/order.service';

@Component({
  selector: 'app-order-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-details-modal.component.html',
  styleUrls: ['./order-details-modal.component.css']
})
export class OrderDetailsModalComponent {
  @Input() order!: Order;
  @Output() close = new EventEmitter<void>();
  @Output() cancelOrder = new EventEmitter<Order>();

  observations: string = '';

  statusLabels: Record<string, string> = {
    'pending': 'Novo',
    'preparing': 'Em Preparo',
    'ready': 'Pronto',
    'delivering': 'Em Rota',
    'delivered': 'Entregue',
    'cancelled': 'Cancelado'
  };

  statusColors: Record<string, string> = {
    'pending': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    'preparing': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    'ready': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    'delivering': 'bg-green-500/20 text-green-500 border-green-500/30',
    'delivered': 'bg-stone-500/20 text-stone-400 border-stone-500/30',
    'cancelled': 'bg-red-500/20 text-red-500 border-red-500/30'
  };

  constructor() {}

  ngOnInit() {
  }

  onClose() {
    this.close.emit();
  }

  onCancel() {
      this.cancelOrder.emit(this.order);
  }

}
