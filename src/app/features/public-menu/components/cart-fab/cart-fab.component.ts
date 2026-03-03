import { Component, EventEmitter, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'yami-cart-fab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-fab.component.html',
  styleUrls: ['./cart-fab.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartFabComponent {
  @Output() openCart = new EventEmitter<void>();
  cart = inject(CartService);
}
