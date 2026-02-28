import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StorefrontService } from './storefront.service';
import { Store } from '../../core/services/store.service';
import { Category, Product } from '../../core/services/menu.service';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './storefront.component.html',
})
export class StorefrontComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private storefrontService = inject(StorefrontService);

  store: Store | null = null;
  categories: Category[] = [];
  products: Product[] = [];
  isLoading = true;
  notFound = false;
  activeCategory: string | null = null;

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';

    const store = await this.storefrontService.fetchStoreBySlug(slug);

    if (!store) {
      this.notFound = true;
      this.isLoading = false;
      return;
    }

    this.store = store;

    const menu = await this.storefrontService.fetchPublicMenu(store.id);
    this.categories = menu.categories;
    this.products = menu.products;

    if (this.categories.length > 0) {
      this.activeCategory = this.categories[0].id;
    }

    this.isLoading = false;
  }

  get filteredProducts(): Product[] {
    if (!this.activeCategory) return this.products;
    return this.products.filter(p => p.category_id === this.activeCategory);
  }

  setCategory(id: string): void {
    this.activeCategory = id;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
