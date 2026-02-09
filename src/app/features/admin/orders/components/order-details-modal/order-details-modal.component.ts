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
