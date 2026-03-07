import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalOptionGroup, LocalOptionItem } from '../../../../../core/models/yami.types';

@Component({
  selector: 'app-local-addon-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">

      <div *ngFor="let group of groups(); let gi = index"
           class="bg-stone-950 rounded-xl border border-stone-800 overflow-hidden">

        <div class="flex items-center gap-2 px-4 py-3 border-b border-stone-800 bg-stone-900/60">
          <span class="material-symbols-outlined text-amber-500 text-base">list_alt</span>
          <input
            [(ngModel)]="group.name"
            (ngModelChange)="emitChange()"
            placeholder="Nome do grupo"
            class="flex-1 min-w-0 bg-transparent text-white font-semibold text-sm focus:outline-none placeholder-stone-600"
          />

          <div class="flex items-center gap-1 shrink-0">
            <span class="text-xs text-stone-500">Mín</span>
            <input
              type="number"
              [(ngModel)]="group.min"
              (ngModelChange)="onMinChange(group); emitChange()"
              min="0"
              class="w-10 bg-stone-900 border border-stone-800 rounded px-1.5 py-1 text-xs text-white text-center focus:border-amber-500 focus:outline-none"
            />
            <span class="text-xs text-stone-500">Máx</span>
            <input
              type="number"
              [(ngModel)]="group.max"
              (ngModelChange)="emitChange()"
              min="0"
              class="w-10 bg-stone-900 border border-stone-800 rounded px-1.5 py-1 text-xs text-white text-center focus:border-amber-500 focus:outline-none"
            />
          </div>

          <label class="flex items-center gap-1.5 text-xs text-stone-400 cursor-pointer shrink-0">
            <input
              type="checkbox"
              [(ngModel)]="group.required"
              (ngModelChange)="emitChange()"
              class="accent-amber-500 w-3.5 h-3.5"
            />
            Obrigatório
          </label>

          <select
            [(ngModel)]="group.price_type"
            (ngModelChange)="emitChange()"
            class="bg-stone-900 border border-stone-800 rounded px-2 py-1 text-xs text-white focus:border-amber-500 focus:outline-none ml-2"
          >
            <option value="sum">Soma (Ex: Hambúrguer)</option>
            <option value="max_price">Maior Valor (Ex: Pizza)</option>
          </select>

          <button
            (click)="removeGroup(gi)"
            class="text-stone-600 hover:text-red-400 transition-colors"
            title="Remover grupo"
          >
            <span class="material-symbols-outlined text-base">delete</span>
          </button>
        </div>

        <div class="p-3 space-y-2">
          <div *ngFor="let opt of group.options; let oi = index"
               class="flex items-center gap-2 group/opt">
            <input
              [(ngModel)]="opt.name"
              (ngModelChange)="emitChange()"
              placeholder="Nome da opção"
              class="flex-1 bg-stone-900 border border-stone-800 rounded-lg px-3 py-1.5 text-sm text-white placeholder-stone-600 focus:border-amber-500 focus:outline-none transition-colors"
            />
            <div class="flex items-center bg-stone-900 border border-stone-800 rounded-lg overflow-hidden focus-within:border-amber-500 transition-colors shrink-0">
              <span class="text-xs text-stone-500 pl-2.5 pr-1 select-none">R$</span>
              <input
                type="number"
                [(ngModel)]="opt.price"
                (ngModelChange)="emitChange()"
                min="0"
                step="0.50"
                class="w-16 bg-transparent py-1.5 pr-2.5 text-sm text-white focus:outline-none"
              />
            </div>
            <button
              (click)="removeOption(gi, oi)"
              class="text-stone-700 hover:text-red-400 transition-colors opacity-0 group-hover/opt:opacity-100"
            >
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <button
            (click)="addOption(gi)"
            class="flex items-center gap-1.5 text-xs text-stone-500 hover:text-amber-400 transition-colors mt-1 px-1"
          >
            <span class="material-symbols-outlined text-sm">add</span>
            Adicionar opção
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
export class LocalAddonEditorComponent {
  @Output() groupsChange = new EventEmitter<LocalOptionGroup[]>();

  groups = signal<LocalOptionGroup[]>([]);

  addGroup() {
    const newGroup: LocalOptionGroup = { name: 'Adicionais', min: 0, max: 0, required: false, price_type: 'sum', options: [] };
    this.groups.update(g => [...g, newGroup]);
    this.emitChange();
  }

  removeGroup(index: number) {
    this.groups.update(g => g.filter((_, i) => i !== index));
    this.emitChange();
  }

  addOption(groupIndex: number) {
    const newOpt: LocalOptionItem = { name: '', price: 0 };
    this.groups.update(g =>
      g.map((group, i) => i === groupIndex ? { ...group, options: [...group.options, newOpt] } : group)
    );
    this.emitChange();
  }

  removeOption(groupIndex: number, optionIndex: number) {
    this.groups.update(g =>
      g.map((group, i) =>
        i === groupIndex
          ? { ...group, options: group.options.filter((_, oi) => oi !== optionIndex) }
          : group
      )
    );
    this.emitChange();
  }

  onMinChange(group: LocalOptionGroup) {
    if (group.min > 0) {
      group.required = true;
    }
  }

  emitChange() {
    this.groupsChange.emit(this.groups());
  }

  getGroups(): LocalOptionGroup[] {
    return this.groups();
  }
}
