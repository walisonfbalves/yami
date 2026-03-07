import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { CategoryManagerComponent } from './components/category-manager/category-manager.component';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { BadgeComponent } from '../../../shared/ui/badge/badge.component';
import { DialogComponent } from '../../../shared/ui/dialog/dialog.component';
import { MenuService, Product, Category } from '../../../core/services/menu.service';
import { StoreService } from '../../../core/services/store.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';
import {
  Subscription,
  Subject,
  takeUntil,
  forkJoin,
  switchMap,
  of,
  filter,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-menu-manager',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ProductFormComponent,
    CategoryManagerComponent,
    CardComponent,
    ButtonComponent,
    InputComponent,
    BadgeComponent,
    DialogComponent,
  ],
  templateUrl: './menu-manager.component.html',
})
export class MenuManagerComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory: Category | 'Todos' = 'Todos';

  private storeService = inject(StoreService);
  private menuService = inject(MenuService);
  private toastService = inject(ToastService);

  storeId = '';

  searchTerm = '';
  searchControl = new FormControl('');
  isLoading = false;

  readonly PAGE_SIZE = 12;
  currentPage = 1;

  showForm = false;
  showCategoryManager = false;
  editingProduct: Product | null = null;
  defaultCategoryId: string | null = null;
  showDeleteModal = false;
  itemToDelete: Product | null = null;

  private destroy$ = new Subject<void>();

  constructor() {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.searchTerm = value || '';
      });
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    // Subscribe to global loading state
    this.menuService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.isLoading = loading;
      });

    this.storeService.currentStore$
      .pipe(
        takeUntil(this.destroy$),
        filter((store) => !!store), // 1. Só passa se a loja existir
        tap((store) => {
          if (store) console.log('Loja carregada:', store.id);
          this.storeId = store?.id || '';
        }),
        switchMap((store) => {
          if (!store) return of({ categories: [], products: [] });
          // 3. Busca produtos dessa loja
          return this.menuService.fetchMenu(store.id);
        }),
        tap((data) => console.log('Dados do menu carregados:', data)), // 4. Debug Final
      )
      .subscribe({
        next: async (data: any) => {
          if (data) {
            this.products = data.products;
            if (data.categories.length === 0) {
              try {
                await this.menuService.createCategory('Geral');
                this.categories = this.menuService['_categories'].value;
              } catch (err) {
                console.error('Erro ao criar categoria padrão:', err);
                this.categories = [];
              }
            } else {
              this.categories = data.categories;
            }
          }
        },
        error: (err) => console.error('Error loading menu:', err),
      });
  }

  get filteredProducts() {
    const term = this.searchTerm.toLowerCase().trim();
    return this.products.filter((product) => {
      const matchesCategory =
        this.selectedCategory === 'Todos' ||
        product.category_id === (this.selectedCategory as any).id;
      const matchesSearch =
        term === '' ||
        product.name.toLowerCase().includes(term) ||
        (product.description || '').toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.PAGE_SIZE);
  }

  get showPaginator(): boolean {
    return this.filteredProducts.length > this.PAGE_SIZE;
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.PAGE_SIZE;
    return this.filteredProducts.slice(start, start + this.PAGE_SIZE);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  setCategory(category: Category | 'Todos') {
    this.selectedCategory = category;
    this.currentPage = 1;
  }

  async toggleAvailability(product: Product) {
    if (!product.id) return;

    const newStatus = !product.is_available;
    // Optimistic update
    product.is_available = newStatus;

    try {
      await this.menuService.updateProduct(product.id, {
        is_available: newStatus,
      });
    } catch (error) {
      // Revert on error
      product.is_available = !newStatus;
      console.error('Failed to update availability', error);
    }
  }

  openForm(product: Product | null = null) {
    this.showForm = true;
    this.editingProduct = product;
    if (!product) {
      this.defaultCategoryId =
        this.selectedCategory !== 'Todos'
          ? (this.selectedCategory as any).id
          : null;
    } else {
      this.defaultCategoryId = null;
    }
  }

  closeForm() {
    this.showForm = false;
    this.editingProduct = null;
  }

  async handleSaveProduct(productData: any) {
    const { addonGroups, ...rest } = productData;
    const productPayload: any = {
      ...rest,
      store_id: this.storeId,
    };

    try {
      if (this.editingProduct && this.editingProduct.id) {
        const updatedProduct = await this.menuService.updateProduct(
          this.editingProduct.id,
          productPayload,
        );
        this.products = this.products.map((p) =>
          p.id === updatedProduct.id ? updatedProduct : p,
        );
        this.toastService.show('Produto atualizado com sucesso!', 'success');
      } else {
        const newProduct = await this.menuService.createProduct(productPayload);
        this.products = [...this.products, newProduct];

        if (addonGroups?.length > 0) {
          try {
            await this.menuService.saveAddonGroups(newProduct.id, this.storeId, addonGroups);
          } catch (addonErr) {
            console.error('Erro ao salvar adicionais:', addonErr);
          }
        }
        this.toastService.show('Produto criado com sucesso!', 'success');
      }
      this.closeForm();
    } catch (err) {
      console.error('Error saving product', err);
      this.toastService.show('Erro ao salvar produto.', 'error');
    }
  }

  confirmDelete(product: Product) {
    this.itemToDelete = product;
    this.showDeleteModal = true;
  }

  async executeDelete() {
    if (this.itemToDelete && this.itemToDelete.id) {
      const productId = this.itemToDelete.id;
      try {
        await this.menuService.deleteProduct(productId);

        // UI Instantânea: Remove o item da lista local visualmente
        this.products = this.products.filter((p) => p.id !== productId);
        console.log('Produto excluído com sucesso (UI atualizada)');

        this.cancelDelete();
      } catch (err) {
        console.error('Error deleting product', err);
      }
    } else {
      this.cancelDelete();
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  updateCategories() {
    this.loadData();
    // Keep manager open or close? Using boolean flag in template to close it via (close) event.
    // Use this method just to reload data.
    // The template has (close)="showCategoryManager = false", so no need to close here if we want to keep it open or if update doesn't imply closing.
    // However, the component emits update when "Save and Close" is clicked.
    // Actually, CategoryManager emits update on add/delete now.
    // And it has a "Concluir" button which calls onClose -> close emit.
    // So updateCategories should just reload data.
  }
}
