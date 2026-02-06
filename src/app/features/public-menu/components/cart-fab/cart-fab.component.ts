import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../../core/services/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from '../../../../core/models/yami.types';

@Component({
  selector: 'yami-cart-fab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="items$ | async as items">
      <button *ngIf="items.length > 0" (click)="openCart.emit()" 
              class="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-auto bg-primary text-primary-fg shadow-xl shadow-amber-900/30 rounded-xl p-4 flex items-center justify-between font-heading font-medium transition-transform hover:scale-105 active:scale-95 z-50">
        
        <div class="flex items-center gap-2">
          <span class="bg-background/20 px-2 py-0.5 rounded text-sm font-bold">{{ getTotalCount(items) }}</span>
          <span class="text-sm uppercase tracking-wide">Ver Sacola</span>
        </div>

        <span class="text-lg font-bold ml-4">
          {{ total$ | async | currency:'BRL':'symbol':'1.2-2' }}
        </span>

      </button>
    </ng-container>
  `
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
