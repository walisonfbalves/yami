import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, PaymentMethod } from '../../../../core/services/cart.service';
import { StoreService } from '../../../../core/services/store.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="close.emit()"></div>

      <div class="relative w-full md:max-w-lg bg-stone-900 md:rounded-2xl overflow-hidden shadow-2xl border border-stone-800 animate-slide-up max-h-[95vh] flex flex-col">
        <div class="shrink-0 flex items-center justify-between px-5 py-4 border-b border-stone-800">
          <div>
            <h2 class="text-lg font-bold text-white">Finalizar Pedido</h2>
            <p class="text-xs text-stone-400 mt-0.5">Revise seus itens e escolha o pagamento</p>
          </div>
          <button
            (click)="close.emit()"
            class="w-9 h-9 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-500 transition-colors"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div class="p-5 space-y-6">
            <div>
              <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Itens no Carrinho</h3>
              <div class="space-y-3">
                <div
                  *ngFor="let item of cart.items()"
                  class="flex items-center gap-3 bg-stone-800/60 rounded-xl p-3 border border-stone-700/50"
                >
                  <img
                    *ngIf="item.image_url"
                    [src]="item.image_url"
                    [alt]="item.name"
                    class="w-14 h-14 rounded-lg object-cover shrink-0 bg-stone-700"
                  />
                  <div *ngIf="!item.image_url" class="w-14 h-14 rounded-lg bg-stone-700 flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-stone-500 text-xl">lunch_dining</span>
                  </div>

                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-white leading-tight line-clamp-1">{{ item.name }}</p>
                    
                    <!-- Adicionais -->
                    <div *ngIf="item.addons && item.addons.length > 0" class="mt-1 space-y-0.5">
                      <p *ngFor="let addon of item.addons" class="text-[11px] text-stone-500 leading-tight">
                        + {{ addon.item.name }} ({{ addon.item.price | currency:'BRL':'symbol':'1.2-2' }})
                      </p>
                    </div>

                    <div *ngIf="item.observations" class="mt-1">
                      <p class="text-[11px] text-amber-500/80 leading-tight line-clamp-2">Obs: {{ item.observations }}</p>
                    </div>

                    <p class="text-xs text-stone-400 mt-1">
                      {{ getItemUnitPrice(item) | currency:'BRL':'symbol':'1.2-2' }} un.
                    </p>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <button
                      (click)="cart.decrement(item.cartItemId || item.id)"
                      class="w-7 h-7 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center transition-colors"
                    >
                      <span class="material-symbols-outlined text-sm text-white">remove</span>
                    </button>
                    <span class="w-5 text-center text-sm font-bold text-white">{{ item.quantity }}</span>
                    <button
                      (click)="cart.increment(item.cartItemId || item.id)"
                      class="w-7 h-7 rounded-full bg-stone-700 hover:bg-stone-600 flex items-center justify-center transition-colors"
                    >
                      <span class="material-symbols-outlined text-sm text-white">add</span>
                    </button>

                    <p class="text-sm font-bold text-amber-400 w-16 text-right">
                      {{ getItemTotal(item) | currency:'BRL':'symbol':'1.2-2' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-amber-500 text-lg">payments</span>
                <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider">Método de Pagamento</h3>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <button
                  *ngFor="let method of paymentOptions"
                  (click)="cart.setPaymentMethod(method.key)"
                  class="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all"
                  [ngClass]="cart.paymentMethod() === method.key
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'"
                >
                  <span class="material-symbols-outlined text-xl">{{ method.icon }}</span>
                  <span class="text-xs font-medium">{{ method.label }}</span>
                  <span class="text-[10px] text-stone-500">{{ method.subtitle }}</span>
                </button>
              </div>
            </div>

            <div class="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-stone-400">Subtotal</span>
                <span class="text-white font-medium">{{ cart.subtotal() | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-stone-400">Taxa de entrega</span>
                <span class="text-white font-medium">{{ cart.deliveryFee() | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-stone-700">
                <span class="font-bold text-white">Total</span>
                <span class="font-bold text-amber-400 text-lg">{{ cart.total() | currency:'BRL':'symbol':'1.2-2' }}</span>
              </div>
            </div>
            
            <div *ngIf="!hasMinimumOrder" class="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <span class="material-symbols-outlined text-red-400 text-lg shrink-0">info</span>
              <p class="text-xs text-red-300 leading-relaxed">
                O valor mínimo para pedidos nesta loja é de <span class="font-bold">{{ minOrderValue | currency:'BRL':'symbol':'1.2-2' }}</span>.
                Faltam <span class="font-bold">{{ (minOrderValue - cart.subtotal()) | currency:'BRL':'symbol':'1.2-2' }}</span> para atingir o mínimo.
              </p>
            </div>
            
          </div>
        </div>

        <div class="shrink-0 p-4 border-t border-stone-800 space-y-2">
          <button
            (click)="finalize()"
            [disabled]="!hasMinimumOrder"
            class="w-full h-12 rounded-xl text-stone-900 font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            [ngClass]="hasMinimumOrder 
              ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/25 active:scale-95' 
              : 'bg-stone-700 text-stone-400 cursor-not-allowed opacity-70 shadow-none'"
          >
            <span class="material-symbols-outlined text-lg">{{ hasMinimumOrder ? 'check_circle' : 'block' }}</span>
            {{ hasMinimumOrder ? 'Finalizar Pedido · ' + (cart.total() | currency:'BRL':'symbol':'1.2-2') : 'Valor Mínimo Não Atingido' }}
          </button>
          <p class="text-xs text-stone-600 text-center">
            Ao finalizar, você concorda com nossos
            <a routerLink="/legal/terms" class="text-stone-500 hover:text-stone-400 underline">Termos</a>
            e
            <a routerLink="/legal/privacy" class="text-stone-500 hover:text-stone-400 underline">Privacidade</a>.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .animate-slide-up { animation: slideUp 0.25s cubic-bezier(0.16,1,0.3,1); }
  `]
})
export class CheckoutComponent {
  @Output() close = new EventEmitter<void>();
  @Output() orderPlaced = new EventEmitter<void>();

  cart = inject(CartService);
  storeService = inject(StoreService);

  paymentOptions: { key: PaymentMethod; label: string; subtitle: string; icon: string }[] = [
    { key: 'pix', label: 'Pix', subtitle: 'Instantâneo', icon: 'qr_code' },
    { key: 'card', label: 'Cartão', subtitle: 'Créd/Déb', icon: 'credit_card' },
    { key: 'cash', label: 'Dinheiro', subtitle: 'Na entrega', icon: 'payments' }
  ];

  get minOrderValue(): number {
    let currentStore: any;
    this.storeService.currentStore$.subscribe(s => currentStore = s).unsubscribe();
    return currentStore?.min_order_value || 0;
  }

  get hasMinimumOrder(): boolean {
    // A validação de mínimo é baseada no subtotal (apenas os itens), geralmente a taxa de entrega é cobrada a parte
    return this.cart.subtotal() >= this.minOrderValue;
  }

  getAddonsTotal(addons: any[]): number {
    return addons.reduce((sum, a) => sum + a.item.price, 0);
  }

  getItemUnitPrice(item: any): number {
    return item.price + (item.addons ? this.getAddonsTotal(item.addons) : 0);
  }

  getItemTotal(item: any): number {
    return this.getItemUnitPrice(item) * item.quantity;
  }

  finalize() {
    if (!this.hasMinimumOrder) return;
    this.orderPlaced.emit();
    this.cart.clear();
    this.close.emit();
  }
}
