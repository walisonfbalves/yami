import { Component, EventEmitter, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '@core/services/cart.service';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'yami-cart-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartModalComponent {
  @Output() close = new EventEmitter<void>();
  cart = inject(CartService);

  customerName = '';
  customerAddress = '';

  addItem(productId: string) {
    this.cart.increment(productId);
  }

  removeItem(productId: string) {
    this.cart.decrement(productId);
  }

  checkout() {
    if (!this.customerName || !this.customerAddress) return;
    const url = this.cart.generateWhatsappLink(this.customerName);
    window.open(url, '_blank');
    this.close.emit();
    this.cart.clear();
  }
}
