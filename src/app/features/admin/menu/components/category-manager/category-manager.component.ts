import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogService } from '../../../../../shared/ui/dialog/dialog.service';
import { Category, MenuService } from '../../../../../core/services/menu.service';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div class="bg-stone-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[90vh] animate-scale-in">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-stone-800 bg-stone-900/50">
                <h3 class="text-xl font-heading font-bold text-white uppercase tracking-wide">
                    Gerenciar Categorias
                </h3>
                <button (click)="onClose()" class="text-stone-500 hover:text-white transition-colors">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            
            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
                
                <!-- Add Category -->
                <div class="flex gap-2 mb-6">
                    <input [(ngModel)]="newCategoryName" 
                           (keydown.enter)="addCategory()"
                           [disabled]="isLoading"
                           type="text" 
                           placeholder="Nova Categoria"
                           class="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-stone-600">
                    
                    <button (click)="addCategory()" 
                            [disabled]="!newCategoryName.trim() || isLoading"
                            class="bg-primary/20 text-primary hover:bg-primary hover:text-background-dark w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <span *ngIf="!isLoading" class="material-symbols-outlined">add</span>
                        <div *ngIf="isLoading" class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </button>
                </div>

                <!-- List -->
                <ul class="space-y-2">
                    <li *ngFor="let category of categories" 
                        class="flex items-center justify-between p-3 rounded-xl bg-stone-950 hover:bg-stone-900 border border-transparent hover:border-stone-800 transition-all group">
                        
                        <span class="font-bold text-stone-400 group-hover:text-white transition-colors">
                            {{ category.name }}
                        </span>

                        <div class="flex items-center gap-1">
                             <!-- Future: Add sorting/editing here -->
                            <button (click)="removeCategory(category)"
                                    [disabled]="isLoading"
                                    class="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-red-500/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed">
                                <span class="material-symbols-outlined text-lg">delete</span>
                            </button>
                        </div>
                    </li>
                    <li *ngIf="categories.length === 0" class="text-center py-4 text-stone-600 text-sm">
                        Nenhuma categoria cadastrada.
                    </li>
                </ul>

            </div>

            <!-- Footer -->
            <div class="p-4 border-t border-stone-800 bg-stone-900/50 flex justify-end">
                <button (click)="onClose()" 
                        class="px-6 py-2.5 rounded-xl bg-primary text-background-dark font-bold hover:bg-amber-600 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
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
  @Input() categories: Category[] = [];
  @Input() storeId: string = '';
  @Output() update = new EventEmitter<void>(); // Just emit signal to reload
  @Output() close = new EventEmitter<void>();

  newCategoryName = '';
  isLoading = false;
  
  private dialogService = inject(DialogService);
  private menuService = inject(MenuService);

  addCategory() {
    const name = this.newCategoryName.trim();
    if (!name || !this.storeId) return;

    // Case insensitive duplicate check
    if (this.categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      this.dialogService.alert('Categoria Duplicada', 'Esta categoria já existe!');
      return;
    }

    this.isLoading = true;
    const newCategory: Category = {
        store_id: this.storeId,
        name: name,
        sort_order: this.categories.length + 1
    };

    this.menuService.createCategory(newCategory).subscribe({
        next: () => {
            this.newCategoryName = '';
            this.update.emit();
            this.isLoading = false;
        },
        error: (err) => {
            console.error('Error creating category', err);
            this.dialogService.alert('Erro', 'Não foi possível criar a categoria.');
            this.isLoading = false;
        }
    });
  }

  removeCategory(category: Category) {
    if (!category.id) return;
    
    // Check if category has products? Supabase might enforce FK, but good to warn.
    // For now, simple delete.
    
    this.isLoading = true;
    this.menuService.deleteCategory(category.id).subscribe({
        next: () => {
            this.update.emit();
            this.isLoading = false;
        },
        error: (err) => {
             console.error('Error deleting category', err);
             this.dialogService.alert('Erro', 'Não foi possível excluir a categoria.');
             this.isLoading = false;
        }
    });
  }

  onClose() {
    this.close.emit();
  }
}
