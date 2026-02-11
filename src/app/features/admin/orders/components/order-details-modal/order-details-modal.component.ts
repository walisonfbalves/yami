import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../order-kanban.component';

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
    'PENDING': 'Novo',
    'PREPARING': 'Em Preparo',
    'READY': 'Pronto',
    'OUT_FOR_DELIVERY': 'Em Rota',
    'DELIVERED': 'Entregue'
  };

  statusColors: Record<string, string> = {
    'PENDING': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    'PREPARING': 'bg-orange-500/20 text-orange-500 border-orange-500/30',
    'READY': 'bg-blue-500/20 text-blue-500 border-blue-500/30',
    'OUT_FOR_DELIVERY': 'bg-green-500/20 text-green-500 border-green-500/30',
    'DELIVERED': 'bg-stone-500/20 text-stone-400 border-stone-500/30'
  };

  constructor() {}

  ngOnInit() {
      // Mock existing observations if any
      this.observations = 'Sem cebola, por favor.';
  }

  onClose() {
    this.close.emit();
  }

  onCancel() {
      this.cancelOrder.emit(this.order);
  }

  // Helper to calculate subtotal (mock logic as we only have string items)
  // In a real app, items would be objects with prices.
  // For now, we rely on order.total
}
