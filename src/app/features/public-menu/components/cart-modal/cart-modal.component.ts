import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../../core/services/cart.service';
import { CartItem } from '../../../../core/models/yami.types';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'yami-cart-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent {
  @Output() close = new EventEmitter<void>();
  items$ = this.cartService.items$;
  total$ = this.cartService.total$;

  customerName = '';
  customerAddress = '';

  constructor(private cartService: CartService) {}

  addItem(item: CartItem) {
    this.cartService.addToCart(item);
  }

  removeItem(itemId: string) {
    this.cartService.removeFromCart(itemId);
  }

  checkout() {
    if (!this.customerName || !this.customerAddress) return;
    
    const url = this.cartService.generateWhatsappLink(this.customerName, this.customerAddress);
    window.open(url, '_blank');
    this.close.emit();
    this.cartService.clearCart();
  }
}
