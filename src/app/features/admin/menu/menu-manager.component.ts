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
import { Subscription, Subject, takeUntil, forkJoin } from 'rxjs';

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
    DialogComponent
  ],
  templateUrl: './menu-manager.component.html'
})
export class MenuManagerComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategory: Category | 'Todos' = 'Todos';

  private storeService = inject(StoreService); // Inject StoreService
  private menuService = inject(MenuService);
  // private authService = inject(AuthService); 
  
  storeId = ''; 

  searchTerm = '';
  searchControl = new FormControl('');
  isLoading = false;

  showForm = false;
  showCategoryManager = false;
  editingProduct: Product | null = null;
  showDeleteModal = false;
  itemToDelete: Product | null = null;
  
  private destroy$ = new Subject<void>();

  constructor() {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
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
      this.isLoading = true;
      
      this.storeService.currentStore$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(store => {
          if (store) {
              this.storeId = store.id;
              // MenuService auto-fetches, but we can verify or just rely on streams
              this.isLoading = false; // logic simplified
          }
      });

      this.menuService.categories$.pipe(takeUntil(this.destroy$)).subscribe(cats => this.categories = cats);
      this.menuService.products$.pipe(takeUntil(this.destroy$)).subscribe(prods => {
          this.products = prods;
          this.isLoading = false;
      });
  }

  setCategory(category: Category | 'Todos') {
    this.selectedCategory = category;
  }

  get filteredProducts() {
      const term = this.searchTerm.toLowerCase().trim();

      return this.products.filter(product => {
        const matchesCategory = this.selectedCategory === 'Todos' || product.category_id === this.selectedCategory.id;

        const matchesSearch = term === '' || 
                              product.name.toLowerCase().includes(term) || 
                              (product.description || '').toLowerCase().includes(term);

        return matchesCategory && matchesSearch;
      });
  }

  async toggleAvailability(product: Product) {
      if (!product.id) return;
      
      const newStatus = !product.is_available;
      // Optimistic update
      product.is_available = newStatus;

      try {
          await this.menuService.updateProduct(product.id, { is_available: newStatus });
      } catch (error) {
           // Revert on error
           product.is_available = !newStatus;
           console.error('Failed to update availability', error);
      }
  }

  openForm(product: Product | null = null) {
    this.showForm = true;
    this.editingProduct = product;
  }

  closeForm() {
    this.showForm = false;
    this.editingProduct = null;
  }

  async handleSaveProduct(productData: any) {
      const productPayload: any = {
          ...productData,
          store_id: this.storeId
      };

      try {
          if (this.editingProduct && this.editingProduct.id) {
              await this.menuService.updateProduct(this.editingProduct.id, productPayload);
          } else {
              await this.menuService.createProduct(productPayload);
          }
          this.closeForm();
      } catch (err) {
          console.error('Error saving product', err);
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
