import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddonsService } from '../../../../../core/services/addons.service';
import { AddonGroup, AddonItem } from '../../../../../core/models/yami.types';

@Component({
  selector: 'app-addon-group-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">

      <div *ngIf="isLoading()" class="text-center py-6">
        <span class="material-symbols-outlined animate-spin text-amber-500">progress_activity</span>
      </div>

      <div *ngFor="let group of groups(); let gi = index" class="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">
        <div class="flex items-center gap-3 px-4 py-3 border-b border-stone-800 bg-stone-900/50">
          <span class="material-symbols-outlined text-amber-500 text-lg">list_alt</span>
          <input
            [(ngModel)]="group.name"
            (blur)="saveGroup(group)"
            placeholder="Nome do grupo"
            class="flex-1 bg-transparent text-white font-semibold text-sm focus:outline-none placeholder-stone-600"
          />
          <label class="flex items-center gap-2 text-xs text-stone-400 cursor-pointer shrink-0">
            <input
              type="checkbox"
              [(ngModel)]="group.required"
              (change)="saveGroup(group)"
              class="accent-amber-500 w-3.5 h-3.5"
            />
            Obrigatório
          </label>
          <button
            (click)="deleteGroup(group, gi)"
            class="text-stone-600 hover:text-red-400 transition-colors"
            title="Excluir grupo"
          >
            <span class="material-symbols-outlined text-base">delete</span>
          </button>
        </div>

        <div class="p-3 space-y-2">
          <div *ngFor="let item of group.items; let ii = index" class="flex items-center gap-2 group/item">
            <input
              [(ngModel)]="item.name"
              (blur)="saveItem(item)"
              placeholder="Nome do adicional"
              class="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none transition-colors"
            />
            <div class="flex items-center bg-stone-900 border border-stone-800 rounded-lg overflow-hidden focus-within:border-amber-500 transition-colors shrink-0">
              <span class="text-xs text-stone-500 pl-3 pr-1 select-none">R$</span>
              <input
                type="number"
                [(ngModel)]="item.price"
                (blur)="saveItem(item)"
                min="0"
                step="0.50"
                class="w-20 bg-transparent py-2 pr-3 text-sm text-white focus:outline-none"
              />
            </div>
            <button
              (click)="deleteItem(item, group, ii)"
              class="text-stone-700 hover:text-red-400 transition-colors opacity-0 group-hover/item:opacity-100"
            >
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <button
            (click)="addItem(group)"
            class="flex items-center gap-1.5 text-xs text-stone-500 hover:text-amber-400 transition-colors mt-2 px-1"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            Adicionar item
          </button>
        </div>
      </div>

      <button
        (click)="addGroup()"
        class="w-full py-3 rounded-xl border-2 border-dashed border-stone-800 text-stone-500 hover:border-amber-500/40 hover:text-amber-400 transition-all text-sm font-medium flex items-center justify-center gap-2"
      >
        <span class="material-symbols-outlined text-base">add</span>
        Novo grupo de adicionais
      </button>
    </div>
  `
})
export class AddonGroupEditorComponent implements OnInit {
  @Input({ required: true }) productId!: string;
  @Input({ required: true }) storeId!: string;

  private addonsService = inject(AddonsService);

  groups = signal<AddonGroup[]>([]);
  isLoading = signal(true);

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.isLoading.set(true);
    try {
      const data = await this.addonsService.getGroupsByProduct(this.productId);
      this.groups.set(data);
    } finally {
      this.isLoading.set(false);
    }
  }

  async addGroup() {
    const group = await this.addonsService.createGroup({
      product_id: this.productId,
      store_id: this.storeId,
      name: 'Adicionais',
      required: false,
      max_choices: 0,
      sort_order: this.groups().length
    });
    this.groups.update(g => [...g, group]);
  }

  async saveGroup(group: AddonGroup) {
    await this.addonsService.updateGroup(group.id, {
      name: group.name,
      required: group.required,
      max_choices: group.max_choices
    });
  }

  async deleteGroup(group: AddonGroup, index: number) {
    await this.addonsService.deleteGroup(group.id);
    this.groups.update(g => g.filter((_, i) => i !== index));
  }

  async addItem(group: AddonGroup) {
    const item = await this.addonsService.createItem({
      group_id: group.id,
      name: '',
      price: 0,
      is_available: true,
      sort_order: group.items.length
    });
    this.groups.update(groups =>
      groups.map(g => g.id === group.id ? { ...g, items: [...g.items, item] } : g)
    );
  }

  async saveItem(item: AddonItem) {
    if (!item.name.trim()) return;
    await this.addonsService.updateItem(item.id, {
      name: item.name,
      price: item.price
    });
  }

  async deleteItem(item: AddonItem, group: AddonGroup, itemIndex: number) {
    await this.addonsService.deleteItem(item.id);
    this.groups.update(groups =>
      groups.map(g =>
        g.id === group.id
          ? { ...g, items: g.items.filter((_, i) => i !== itemIndex) }
          : g
      )
    );
  }
}
