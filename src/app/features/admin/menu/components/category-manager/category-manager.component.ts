import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogService } from '../../../../../shared/ui/dialog/dialog.service';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div class="bg-white dark:bg-surface rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 dark:border-surface-border flex flex-col max-h-[90vh] animate-scale-in">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-stone-200 dark:border-surface-border bg-stone-50 dark:bg-surface/50">
                <h3 class="text-xl font-heading font-bold text-stone-900 dark:text-text-primary">
                    Gerenciar Categorias
                </h3>
                <button (click)="onClose()" class="text-stone-400 hover:text-stone-900 dark:hover:text-text-primary transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                
                <!-- Add Category -->
                <div class="flex gap-2 mb-6">
                    <input [(ngModel)]="newCategoryName" 
                           (keydown.enter)="addCategory()"
                           type="text" 
                           placeholder="Nova Categoria"
                           class="flex-1 bg-stone-100 dark:bg-surface border border-stone-200 dark:border-surface-active rounded-xl px-4 py-2 text-stone-900 dark:text-text-primary focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-stone-400 dark:placeholder-text-secondary">
                    
                    <button (click)="addCategory()" 
                            [disabled]="!newCategoryName.trim()"
                            class="bg-primary/20 text-primary hover:bg-primary hover:text-background w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <span class="material-symbols-outlined">add</span>
                    </button>
                </div>

                <!-- List -->
                <ul class="space-y-2">
                    <li *ngFor="let category of internalCategories; let i = index" 
                        class="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-surface-hover/50 hover:bg-stone-100 dark:hover:bg-surface-hover border border-transparent hover:border-stone-200 dark:hover:border-surface-border transition-all group">
                        
                        <span class="font-bold text-stone-700 dark:text-text-secondary group-hover:text-stone-900 dark:group-hover:text-text-primary transition-colors">
                            {{ category }}
                        </span>

                        <button *ngIf="category !== 'Todos'" 
                                (click)="removeCategory(i)"
                                class="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:bg-danger-bg hover:text-danger transition-colors opacity-0 group-hover:opacity-100">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                         <span *ngIf="category === 'Todos'" class="text-xs font-bold text-stone-400 uppercase tracking-wider px-2">Sistema</span>
                    </li>
                </ul>

            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-stone-200 dark:border-surface-border bg-stone-50 dark:bg-surface/50 flex justify-end">
                <button (click)="saveAndClose()" 
                        class="px-6 py-2.5 rounded-xl bg-primary text-background font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px]">check</span>
                    Concluir
                </button>
            </div>
        </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class CategoryManagerComponent {
  @Input() set categories(value: string[]) {
    // Creating a copy to avoid mutating direct reference before saving
    this.internalCategories = [...value];
  }
  @Output() update = new EventEmitter<string[]>();
  @Output() close = new EventEmitter<void>();

  internalCategories: string[] = [];
  newCategoryName = '';
  private dialogService = inject(DialogService);

  addCategory() {
    const name = this.newCategoryName.trim();
    if (!name) return;

    // Case insensitive duplicate check
    if (this.internalCategories.some(c => c.toLowerCase() === name.toLowerCase())) {
      this.dialogService.alert('Categoria Duplicada', 'Esta categoria já existe!');
      return;
    }

    this.internalCategories.push(name);
    this.newCategoryName = '';
  }

  removeCategory(index: number) {
    if (this.internalCategories[index] === 'Todos') return;
    this.internalCategories.splice(index, 1);
  }

  saveAndClose() {
    this.update.emit(this.internalCategories);
    this.close.emit();
  }

  onClose() {
    this.close.emit();
  }
}
