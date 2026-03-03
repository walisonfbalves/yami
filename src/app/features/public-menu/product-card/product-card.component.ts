import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '@core/models/yami.types';
import { CartService } from '@core/services/cart.service';

@Component({
  selector: 'yami-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input() product!: Product;
  private cartService = inject(CartService);

  addToCart() {
    this.cartService.addItem(this.product);
  }
}
