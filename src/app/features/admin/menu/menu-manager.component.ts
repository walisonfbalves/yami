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

  private menuService = inject(MenuService);
  // private authService = inject(AuthService); // Assuming we can get storeId from auth or another state
  // For now, hardcoding or fetching storeId needs to be handled. 
  // Ideally, storeId comes from the logged-in user's store.
  // Let's assume we have a way to get the current store UUID.
  // TODO: Get real store ID.
  storeId = '639d6759-3315-420a-86c3-16298517220b'; // Replace with actual store ID logic

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
      // Fetch categories and products in parallel or sequentially
      forkJoin({
          categories: this.menuService.getCategories(this.storeId),
          products: this.menuService.getProducts(this.storeId)
      }).subscribe({
          next: ({ categories, products }) => {
              this.categories = categories;
              this.products = products;
              this.isLoading = false;
          },
          error: (err) => {
              console.error('Error loading menu data', err);
              this.isLoading = false;
          }
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

  toggleAvailability(product: Product) {
      if (!product.id) return;
      
      const newStatus = !product.is_available;
      // Optimistic update
      product.is_available = newStatus;

      this.menuService.updateProduct(product.id, { is_available: newStatus }).subscribe({
          error: () => {
              // Revert on error
              product.is_available = !newStatus;
              console.error('Failed to update availability');
          }
      });
  }

  openForm(product: Product | null = null) {
    this.showForm = true;
    this.editingProduct = product;
  }

  closeForm() {
    this.showForm = false;
    this.editingProduct = null;
  }

  handleSaveProduct(productData: any) { // productData from form might need mapping
      // The ProductFormComponent needs to handle the logic of calling create/update or passing data back.
      // If passing data back:
      const productPayload: Product = {
          ...productData,
          store_id: this.storeId
      };

      if (this.editingProduct && this.editingProduct.id) {
          this.menuService.updateProduct(this.editingProduct.id, productPayload).subscribe({
              next: (updatedProduct) => {
                  const index = this.products.findIndex(p => p.id === updatedProduct.id);
                  if (index !== -1) {
                      this.products[index] = updatedProduct;
                  }
                  this.closeForm();
              },
              error: (err) => console.error('Error updating product', err)
          });
      } else {
          this.menuService.createProduct(productPayload).subscribe({
              next: (newProduct) => {
                  this.products.push(newProduct);
                  this.closeForm();
              },
              error: (err) => console.error('Error creating product', err)
          });
      }
  }

  confirmDelete(product: Product) {
    this.itemToDelete = product;
    this.showDeleteModal = true;
  }

  executeDelete() {
    if (this.itemToDelete && this.itemToDelete.id) {
      const productId = this.itemToDelete.id;
      this.menuService.deleteProduct(productId).subscribe({
          next: () => {
              this.products = this.products.filter(p => p.id !== productId);
              this.cancelDelete();
          },
          error: (err) => console.error('Error deleting product', err)
      });
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
