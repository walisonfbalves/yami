import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '@core/services/menu.service';
import { MenuData, Category, Product } from '@core/models/yami.types';
import { Observable } from 'rxjs';
import { ProductCardComponent } from '../product-card/product-card.component';
import { BadgeComponent } from '@shared/ui/badge/badge.component';
import { CartFabComponent } from '../components/cart-fab/cart-fab.component';
import { CartModalComponent } from '../components/cart-modal/cart-modal.component';
import { SkeletonComponent } from '@shared/ui/skeleton/skeleton.component';

@Component({
  selector: 'yami-menu-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, BadgeComponent, CartFabComponent, CartModalComponent, SkeletonComponent],
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuPageComponent implements OnInit {
  menuData!: MenuData;
  isLoading = true;
  isCartOpen = false;

  constructor(
    private menuService: MenuService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.menuService.getRestaurantData('demo').subscribe(data => {
      this.menuData = data;
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  getProductsByCategory(products: Product[], categoryId: string): Product[] {
    return products.filter(p => p.categoryId === categoryId);
  }

  scrollToCategory(categoryId: string) {
    const element = document.getElementById('category-' + categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
