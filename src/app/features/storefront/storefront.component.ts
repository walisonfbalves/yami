import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { StorefrontService } from './storefront.service';
import { CartService } from '../../core/services/cart.service';
import { Store } from '../../core/services/store.service';
import { Category, Product } from '../../core/models/yami.types';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ProductModalComponent, CheckoutComponent],
  templateUrl: './storefront.component.html',
})
export class StorefrontComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private storefrontService = inject(StorefrontService);
  cart = inject(CartService);

  store: Store | null = null;
  categories: Category[] = [];
  products: Product[] = [];
  isLoading = true;
  notFound = false;
  currentYear = new Date().getFullYear();

  activeCategory = signal<string | null>('all');
  selectedProduct = signal<Product | null>(null);
  showCheckout = signal(false);
  orderSuccess = signal(false);

  filteredProducts = computed(() => {
    const cat = this.activeCategory();
    if (!cat || cat === 'all') return this.products;
    return this.products.filter(p => p.category_id === cat);
  });

  getCategoryName(product: Product): string {
    return this.categories.find(c => c.id === product.category_id)?.name ?? '';
  }

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
      this.activeCategory.set('all');
    }

    this.isLoading = false;
  }

  setCategory(id: string): void {
    this.activeCategory.set(id);
  }

  openProduct(product: Product): void {
    if (!product.is_available) return;
    this.selectedProduct.set(product);
  }

  openCheckout(): void {
    if (this.cart.totalItems() === 0) return;
    this.showCheckout.set(true);
  }

  onOrderPlaced(): void {
    this.orderSuccess.set(true);
    setTimeout(() => this.orderSuccess.set(false), 4000);
  }

  formatPrice(price: number): string {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  getWhatsappLink(phone: string): string {
    const onlyNumbers = phone.replace(/\D/g, '');
    return `https://wa.me/55${onlyNumbers}`;
  }

  getInstagramLink(user: string): string {
    const cleanUser = user.replace('@', '').trim();
    return `https://instagram.com/${cleanUser}`;
  }

  getFacebookLink(user: string): string {
    const cleanUser = user.replace('/', '').trim();
    return `https://facebook.com/${cleanUser}`;
  }
}
