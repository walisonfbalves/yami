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
import { TenantService } from '../../../core/services/tenant.service';
import { Subscription } from 'rxjs';

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
  products: any[] = [];

  private tenantService = inject(TenantService);
  private tenantSub!: Subscription;

  selectedCategory = 'Todos';
  categories = ['Todos', 'Burgers', 'Pratos Principais', 'Bebidas', 'Sobremesas'];
  searchTerm = '';
  searchControl = new FormControl('');

  showForm = false;
  showCategoryManager = false;
  editingProduct: any = null;
  showDeleteModal = false;
  itemToDelete: any = null;

  constructor() {
    this.searchControl.valueChanges.subscribe(value => {
      this.searchTerm = value || '';
    });
  }

  ngOnInit() {
    this.tenantSub = this.tenantService.tenant$.subscribe(tenant => {
      this.products = tenant.mockMenu.map((item: any) => ({ ...item }));
      this.categories = ['Todos', ...new Set(this.products.map(p => p.category))] as string[];
      this.selectedCategory = 'Todos';
    });
  }

  ngOnDestroy() {
    this.tenantSub?.unsubscribe();
  }

  setCategory(category: string) {
    this.selectedCategory = category;
  }

  get filteredProducts() {
      const term = this.searchTerm.toLowerCase().trim();

      return this.products.filter(product => {
        const matchesCategory = this.selectedCategory === 'Todos' || product.category === this.selectedCategory;

        const matchesSearch = term === '' || 
                              product.name.toLowerCase().includes(term) || 
                              product.description.toLowerCase().includes(term);

        return matchesCategory && matchesSearch;
      });
  }

  toggleAvailability(product: any) {
    product.available = !product.available;
  }

  openForm(product: any = null) {
    this.showForm = true;
    this.editingProduct = product;
  }

  closeForm() {
    this.showForm = false;
    this.editingProduct = null;
  }

  handleSaveProduct(productData: any) {
      if (this.editingProduct) {
        console.log('Updating Product:', { ...this.editingProduct, ...productData });
        const index = this.products.findIndex(p => p.id === this.editingProduct.id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...productData };
        }

      } else {
        console.log('Creating Product:', productData);
        this.products.push({
            id: this.products.length + 1,
            ...productData,
            popular: false 
        });
      }
      this.closeForm();
  }

  confirmDelete(product: any) {
    this.itemToDelete = product;
    this.showDeleteModal = true;
  }

  executeDelete() {
    if (this.itemToDelete) {
      this.products = this.products.filter(p => p.id !== this.itemToDelete.id);
      console.log('Deleted product', this.itemToDelete.id);
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  updateCategories(newCategories: string[]) {
    this.categories = newCategories;
    this.showCategoryManager = false;
  }
}
