import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '@core/services/menu.service';
import { MenuData, Category, Product } from '@core/models/yami.types';
import { Observable } from 'rxjs';
import { ProductCardComponent } from '../product-card/product-card.component';
import { BadgeComponent } from '@shared/ui/badge/badge.component';
import { CartFabComponent } from '../components/cart-fab/cart-fab.component';
import { CartModalComponent } from '../components/cart-modal/cart-modal.component';

@Component({
  selector: 'yami-menu-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, BadgeComponent, CartFabComponent, CartModalComponent],
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit {
  menuData$!: Observable<MenuData>;
  isCartOpen = false;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuData$ = this.menuService.getRestaurantData('demo');
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
