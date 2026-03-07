import { Component, EventEmitter, Input, OnInit, Output, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, AddonGroup, SelectedAddon, AddonItem } from '../../../../core/models/yami.types';
import { CartService } from '../../../../core/services/cart.service';
import { AddonsService } from '../../../../core/services/addons.service';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="close.emit()"></div>

      <div class="relative w-full md:max-w-2xl bg-stone-900 md:rounded-2xl overflow-hidden shadow-2xl border border-stone-800 animate-slide-up max-h-[95vh] flex flex-col">
        <div class="relative aspect-[16/9] w-full overflow-hidden shrink-0">
          <img
            *ngIf="product.image_url; else noImg"
            [src]="product.image_url"
            [alt]="product.name"
            class="w-full h-full object-cover"
          />
          <ng-template #noImg>
            <div class="w-full h-full bg-stone-800 flex items-center justify-center">
              <span class="material-symbols-outlined text-stone-600 text-7xl">lunch_dining</span>
            </div>
          </ng-template>

          <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/20 to-transparent"></div>

          <button
            (click)="close.emit()"
            class="absolute top-3 right-3 w-9 h-9 rounded-full bg-stone-900/80 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-800 transition-colors backdrop-blur-sm"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>

          <div class="absolute bottom-0 left-0 right-0 p-5">
            <p class="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">{{ categoryName }}</p>
            <h2 class="text-2xl font-bold text-white leading-tight">{{ product.name }}</h2>
            <p class="text-xl font-bold text-amber-400 mt-1">{{ product.price | currency:'BRL':'symbol':'1.2-2' }}</p>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div class="p-5 space-y-6">
            <div *ngIf="product.description" class="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
              <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-amber-500 text-lg">info</span>
                <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Descrição</span>
              </div>
              <p class="text-stone-300 text-sm leading-relaxed">{{ product.description }}</p>
            </div>

            <div *ngIf="isLoadingAddons()" class="flex justify-center py-6">
              <span class="material-symbols-outlined animate-spin text-amber-500 text-3xl">progress_activity</span>
            </div>

            <!-- ADDONS SECTIONS -->
            <ng-container *ngIf="!isLoadingAddons() && addonGroups().length > 0">
              <div *ngFor="let group of addonGroups()" class="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-amber-500 text-lg">add_circle</span>
                    <span class="text-sm font-bold text-white tracking-wide">{{ group.name }}</span>
                  </div>
                  <span *ngIf="group.required" class="bg-stone-700 text-stone-300 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-stone-600">Obrigatório</span>
                  <span *ngIf="!group.required && group.max_choices > 0" class="text-stone-500 text-xs font-medium">Até {{ group.max_choices }}</span>
                  <span *ngIf="!group.required && !group.max_choices" class="text-stone-500 text-xs font-medium">Opcional</span>
                </div>

                <div class="space-y-2">
                  <div *ngFor="let item of group.items" 
                       (click)="toggleAddon(group, item)"
                       class="flex items-center justify-between p-3 rounded-lg border group/addon cursor-pointer transition-all"
                       [ngClass]="isSelected(item) ? 'bg-amber-500/10 border-amber-500 shadow-sm shadow-amber-500/10' : 'bg-stone-900 border-stone-700 hover:border-stone-600'">
                    
                    <div class="flex items-center gap-3">
                      <div class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
                           [ngClass]="isSelected(item) ? 'bg-amber-500 border-amber-500 text-stone-900' : 'bg-stone-800 border-stone-600'">
                        <span *ngIf="isSelected(item)" class="material-symbols-outlined text-[16px] font-bold">check</span>
                      </div>
                      <span class="text-sm font-medium transition-colors" [ngClass]="isSelected(item) ? 'text-amber-500' : 'text-stone-300'">{{ item.name }}</span>
                    </div>

                    <span class="text-sm font-bold" [ngClass]="isSelected(item) ? 'text-amber-500' : 'text-emerald-400'">
                      + {{ item.price | currency:'BRL':'symbol':'1.2-2' }}
                    </span>
                  </div>
                </div>
              </div>
            </ng-container>

            <div class="bg-stone-800/50 rounded-xl p-4 border border-stone-700/50">
              <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-amber-500 text-lg">notes</span>
                <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Observações</span>
              </div>
              <textarea
                [(ngModel)]="observations"
                rows="3"
                placeholder="Ex: sem cebola, ponto da carne bem passado..."
                class="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-stone-600 focus:border-amber-500 focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="shrink-0 p-4 border-t border-stone-800 bg-stone-900">
          <div class="flex items-center gap-4">
            <div class="flex items-center bg-stone-800 border border-stone-700 rounded-xl overflow-hidden shrink-0">
              <button
                (click)="decrement()"
                class="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
              >
                <span class="material-symbols-outlined text-lg">remove</span>
              </button>
              <span class="w-10 text-center font-bold text-white text-base">{{ qty() }}</span>
              <button
                (click)="increment()"
                class="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
              >
                <span class="material-symbols-outlined text-lg">add</span>
              </button>
            </div>

            <button
              (click)="addToCart()"
              class="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-lg">shopping_cart</span>
              Adicionar · {{ itemTotal | currency:'BRL':'symbol':'1.2-2' }}
            </button>
          </div>
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
export class ProductModalComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Input() categoryName = '';
  @Output() close = new EventEmitter<void>();
  @Output() added = new EventEmitter<void>();

  private cartService = inject(CartService);
  private addonsService = inject(AddonsService);

  qty = signal(1);
  observations = '';

  addonGroups = signal<AddonGroup[]>([]);
  isLoadingAddons = signal(true);
  selectedAddons = signal<SelectedAddon[]>([]);

  async ngOnInit() {
    this.qty.set(1);
    await this.loadAddons();
  }

  async loadAddons() {
    this.isLoadingAddons.set(true);
    try {
      const groups = await this.addonsService.getGroupsByProduct(this.product.id);
      this.addonGroups.set(groups);
    } finally {
      this.isLoadingAddons.set(false);
    }
  }

  toggleAddon(group: AddonGroup, item: AddonItem) {
    const current = this.selectedAddons();
    const isAlreadySelected = current.some(a => a.item.id === item.id);
    
    if (isAlreadySelected) {
      // Remove
      this.selectedAddons.update(addons => addons.filter(a => a.item.id !== item.id));
    } else {
      // Add (checking constraints first)
      const groupSelections = current.filter(a => a.groupName === group.name);
      
      // If max_choices is 1, act like a radio button (replace existing)
      if (group.max_choices === 1 && groupSelections.length > 0) {
        this.selectedAddons.update(addons => [
          ...addons.filter(a => a.groupName !== group.name),
          { item, groupName: group.name, groupPriceType: group.price_type || 'sum' }
        ]);
        return;
      }
      
      // If reached max_choices, don't allow adding more
      if (group.max_choices > 0 && groupSelections.length >= group.max_choices) {
        return; // Exceeded limit
      }
      
      this.selectedAddons.update(addons => [...addons, { item, groupName: group.name, groupPriceType: group.price_type || 'sum' }]);
    }
  }

  isSelected(item: AddonItem): boolean {
    return this.selectedAddons().some(a => a.item.id === item.id);
  }

  get addonsTotal(): number {
    const selected = this.selectedAddons();
    if (selected.length === 0) return 0;

    // Agrupa os itens selecionados por nome do grupo
    const grouped = selected.reduce((acc, addon) => {
      if (!acc[addon.groupName]) acc[addon.groupName] = [];
      acc[addon.groupName].push(addon);
      return acc;
    }, {} as Record<string, SelectedAddon[]>);

    let total = 0;
    
    // Para cada grupo, aplica a regra de cálculo (Soma ou Maior Valor)
    for (const groupName in grouped) {
      const selections = grouped[groupName];
      const priceType = selections[0].groupPriceType || 'sum';

      if (priceType === 'max_price') {
        const maxPriceInGroup = Math.max(...selections.map(a => a.item.price));
        total += maxPriceInGroup;
      } else {
        const sumInGroup = selections.reduce((subTotal, a) => subTotal + a.item.price, 0);
        total += sumInGroup;
      }
    }

    return total;
  }

  get itemTotal(): number {
    return (this.product.price + this.addonsTotal) * this.qty();
  }

  get canAddToCart(): boolean {
    // Check if required groups have at least one selection
    return this.addonGroups().every(group => 
      !group.required || this.selectedAddons().some(a => a.groupName === group.name)
    );
  }

  increment() { this.qty.update(q => q + 1); }
  decrement() { this.qty.update(q => Math.max(1, q - 1)); }

  addToCart() {
    if (!this.canAddToCart) return;
    
    for (let i = 0; i < this.qty(); i++) {
      this.cartService.addItem(this.product, this.observations, this.selectedAddons());
    }
    this.added.emit();
    this.close.emit();
  }
}
