import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/yami.types';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'yami-product-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div *ngIf="product" class="flex gap-4 p-4 bg-surface border border-muted rounded-xl shadow-sm hover:border-primary/50 transition-colors">
      <!-- Image -->
      <div class="shrink-0">
        <img [src]="product.imageUrl" [alt]="product.name" class="w-20 h-20 rounded-lg object-cover bg-muted">
      </div>
      
      <!-- Content -->
      <div class="flex flex-col flex-1 justify-between">
        <div>
          <h3 class="font-heading font-medium text-text-main text-lg leading-tight">{{ product.name }}</h3>
          <p class="text-sm text-text-muted mt-1 line-clamp-2">{{ product.description }}</p>
        </div>
        
        <!-- Price & Action -->
        <div class="flex items-center justify-between mt-3">
          <span class="font-heading text-primary font-bold text-lg">
            {{ product.price | currency:'BRL':'symbol':'1.2-2' }}
          </span>
          
          <yami-button variant="primary" size="sm" class="!px-2 !py-1 rounded-full aspect-square flex items-center justify-center" (click)="addToCart()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </yami-button>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  addToCart() {
    this.cartService.addToCart(this.product);
  }
}
