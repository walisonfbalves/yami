import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../core/services/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from '../../../../core/models/yami.types';

@Component({
  selector: 'yami-cart-fab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-fab.component.html',
  styleUrls: ['./cart-fab.component.css']
})
export class CartFabComponent {
  @Output() openCart = new EventEmitter<void>();
  items$ = this.cartService.items$;
  total$ = this.cartService.total$;

  constructor(private cartService: CartService) {}

  getTotalCount(items: CartItem[]): number {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }
}
