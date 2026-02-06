import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem, Product } from '../models/yami.types';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  items$ = this.itemsSubject.asObservable();

  total$ = this.items$.pipe(
    map(items => items.reduce((acc, item) => acc + (item.price * item.quantity), 0))
  );

  constructor() { }

  addToCart(product: Product) {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.itemsSubject.next([...currentItems]);
    } else {
      this.itemsSubject.next([...currentItems, { ...product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: string) {
    const currentItems = this.itemsSubject.value;
    const existingItem = currentItems.find(item => item.id === productId);

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1;
        this.itemsSubject.next([...currentItems]);
      } else {
        this.itemsSubject.next(currentItems.filter(item => item.id !== productId));
      }
    }
  }

  clearCart() {
    this.itemsSubject.next([]);
  }

  generateWhatsappLink(customerName: string, address: string, phoneNumber: string = '5511999999999'): string {
    const items = this.itemsSubject.value;
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    let message = `*Novo Pedido - Yami Delivery*\n\n`;
    message += `*Cliente:* ${customerName}\n`;
    message += `*Endereço:* ${address}\n\n`;
    message += `*Itens:*\n`;

    items.forEach(item => {
      message += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*Total: R$ ${total.toFixed(2)}*`;

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  }
}
