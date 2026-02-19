import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService, Category, Product, MenuData } from '@core/services/menu.service';
import { StoreService } from '@core/services/store.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { BadgeComponent } from '@shared/ui/badge/badge.component';
import { CartFabComponent } from '../components/cart-fab/cart-fab.component';
import { CartModalComponent } from '../components/cart-modal/cart-modal.component';
import { SkeletonComponent } from '@shared/ui/skeleton/skeleton.component';
import { filter, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'yami-menu-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, BadgeComponent, CartFabComponent, CartModalComponent, SkeletonComponent],
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuPageComponent implements OnInit {
  private menuService = inject(MenuService);
  private storeService = inject(StoreService);
  private cdr = inject(ChangeDetectorRef);

  menuData: MenuData = { categories: [], products: [] };
  storeName = '';
  storeLogo = '';
  storeBanner = '';
  isLoading = true;
  isCartOpen = false;

  ngOnInit(): void {
    this.storeService.currentStore$.pipe(
      filter(store => !!store),
      take(1),
      switchMap(store => {
        this.storeName = store!.name ?? '';
        this.storeLogo = store!.logo_url ?? '';
        this.storeBanner = store!.cover_url ?? '';
        return this.menuService.fetchMenu(store!.id);
      })
    ).subscribe({
      next: data => {
        this.menuData = data;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  getProductsByCategory(products: Product[], categoryId: string): Product[] {
    return products.filter(p => p.category_id === categoryId);
  }

  scrollToCategory(categoryId: string) {
    const element = document.getElementById('category-' + categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
